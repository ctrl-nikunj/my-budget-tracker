import React, { useEffect, useState, useRef } from "react";
import successSound from "@/assets/success-83493.mp3";
import errorSound from "@/assets/error-08-206492.mp3";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { format } from "date-fns";
import api from "@/lib/api";
import { useRefreshStore } from "@/lib/refreshStore";

export default function DataTable() {
  const refreshTxn = useRefreshStore((s) => s.refreshTxn);
  const refreshReminders = useRefreshStore((s) => s.refreshReminders);
  const refreshFds = useRefreshStore((s) => s.refreshFds);
  const [transactions, setTransactions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [fds, setFds] = useState([]);
  const [removingReminderIds, setRemovingReminderIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [tx, rm, fd] = await Promise.all([
        api.get("/transactions/recent"),
        api.get("/reminders"),
        api.get("/fds"),
      ]);
      setTransactions(tx.data);
      setReminders(rm.data);
      setFds(fd.data);
    };

    if (refreshTxn || refreshReminders || refreshFds) {
      toast.success("Data refreshed successfully");
    }
    fetchData();
  }, [refreshTxn, refreshReminders, refreshFds]);

  useEffect(() => {
    if (removingReminderIds.length > 0) {
      const timeout = setTimeout(() => {
        setReminders((prev) =>
          prev.filter((rem) => !removingReminderIds.includes(rem.id))
        );
        setRemovingReminderIds([]);
      }, 600); // delay to allow fade-out
      return () => clearTimeout(timeout);
    }
  }, [removingReminderIds]);

  console.log("Transactions:", transactions);
  console.log("Reminders:", reminders);
  console.log("FDs:", fds);

  return (
    <Tabs
      defaultValue="transactions"
      className="w-auto mx-6 font-inter"
    >
      <TabsList>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="reminders">Reminders</TabsTrigger>
        <TabsTrigger value="fds">FDs</TabsTrigger>
      </TabsList>

      <TabsContent value="transactions">
        <PaginatedTable
          data={transactions}
          columns={transactionColumns}
        />
      </TabsContent>

      <TabsContent value="reminders">
        <PaginatedTable
          data={reminders}
          columns={remindersColumns}
          removingReminderIds={removingReminderIds}
          setRemovingReminderIds={setRemovingReminderIds}
        />
      </TabsContent>

      <TabsContent value="fds">
        <PaginatedTable
          data={fds}
          columns={fdsColumns}
        />
      </TabsContent>
    </Tabs>
  );
}

export function PaginatedTable({
  data,
  columns,
  removingReminderIds = [],
  setRemovingReminderIds = () => {},
}) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const successAudioRef = useRef(null);
  const errorAudioRef = useRef(null);

  useEffect(() => {
    // Initialize the Audio objects once when the component mounts
    successAudioRef.current = new Audio(successSound);
    errorAudioRef.current = new Audio(errorSound);

    // Optional: Set volume for sounds
    successAudioRef.current.volume = 0.7; // 70% volume
    errorAudioRef.current.volume = 0.7;
  }, []);

  const playSound = (audioRef) => {
    if (audioRef.current) {
      // Ensure the sound starts from the beginning
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((e) => console.error("Error playing sound:", e));
      // .catch is important because .play() returns a Promise that can reject
      // if the user hasn't interacted with the page yet (browser autoplay policies)
    }
  };

  const table = useReactTable({
    data,
    columns:
      typeof columns === "function"
        ? columns({
            removingReminderIds,
            setRemovingReminderIds,
            playSound,
            successAudioRef,
            errorAudioRef,
          })
        : columns,
    pageCount: Math.ceil(data.length / pagination.pageSize),
    state: { pagination },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: false,
  });

  return (
    <div className="rounded-lg border mt-4">
      <Table className="w-full font-inter">
        <TableHeader className="bg-gray-100 text-black">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className={`
                transition-all duration-500
                ${row.original.completed ? "line-through text-red-800" : ""}
                ${
                  removingReminderIds.includes(row.original.id)
                    ? "opacity-0"
                    : ""
                }
              `}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(data.length > 10 || table.getPageCount() > 1) && (
        <div className="flex items-center justify-between px-4 py-2">
          <div className="text-sm text-muted-foreground">
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const transactionColumns = [
  {
    accessorKey: "transaction_date",
    header: () => <div className="text-center">Date</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {new Date(row.original.transaction_date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: () => <div className="text-center">Category</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.category}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => (
      <div className="text-center">₹{row.original.amount}</div>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center">Type</div>,
    cell: ({ row }) => (
      <div className="text-center capitalize">{row.original.type}</div>
    ),
  },
  {
    accessorKey: "note",
    header: () => <div className="text-center">Note</div>,
    cell: ({ row }) => <div className="text-center">{row.original.note}</div>,
  },
];
const remindersColumns = ({
  removingReminderIds,
  setRemovingReminderIds,
  playSound,
  successAudioRef,
  errorAudioRef,
}) => [
  {
    accessorKey: "id",
    header: () => <div className="text-center"></div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Checkbox
          checked={row.original.completed}
          onCheckedChange={async (checked) => {
            if (checked) {
              // Optimistically mark as completed
              row.original.completed = true;
              setRemovingReminderIds((prev) => [...prev, row.original.id]);

              setTimeout(async () => {
                try {
                  const res = await api.delete(`/reminders/${row.original.id}`);
                  if (res.status === 200) {
                    toast.success("Reminder Deleted Successfully");
                    playSound(successAudioRef);
                  } else {
                    toast.error("Failed to delete reminder");
                    playSound(errorAudioRef);
                  }
                  playSound(successAudioRef);
                } catch (err) {
                  console.error("Error deleting reminder:", err);
                  toast.error("Failed to delete reminder");
                }
              }, 600);
            }
          }}
        />
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: () => <div className="text-center">Title</div>,
    cell: ({ row }) => <div className="text-center">{row.original.title}</div>,
  },
  {
    accessorKey: "due_date",
    header: () => <div className="text-center">Due Date</div>,
    cell: ({ row }) => {
      const due = new Date(row.original.due_date);
      const daysLeft = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));
      return (
        <div
          className={`text-center ${
            daysLeft <= 2 ? "text-red-600 font-semibold" : ""
          }`}
        >
          {due.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => (
      <div className="text-center">₹{row.original.amount}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.status.slice(0, 1).toUpperCase() +
          row.original.status.slice(1)}
      </div>
    ),
  },
];

const fdsColumns = [
  {
    accessorKey: "bank_name",
    header: () => <div className="text-center">Bank</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.bank_name}</div>
    ),
  },
  {
    accessorKey: "account_number",
    header: () => <div className="text-center">Account No.</div>,
    cell: ({ row }) => (
      <div className="text-center">
        ****{row.original.account_number.slice(-4)}
      </div>
    ),
  },
  {
    accessorKey: "interest_rate",
    header: () => <div className="text-center">Rate (%)</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.interest_rate}%</div>
    ),
  },
  {
    accessorKey: "principal",
    header: () => <div className="text-center">Principal</div>,
    cell: ({ row }) => (
      <div className="text-center">₹{row.original.principal}</div>
    ),
  },
  {
    accessorKey: "current_value",
    header: () => <div className="text-center">Current Value</div>,
    cell: ({ row }) => (
      <div className="text-center">₹{row.original.current_value}</div>
    ),
  },
  {
    accessorKey: "maturity_date",
    header: () => <div className="text-center">Maturity Date</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {format(new Date(row.original.maturity_date), "dd MMM yyyy")}
      </div>
    ),
  },
  {
    accessorKey: "is_broken",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.is_broken
          ? "Broken"
          : row.original.is_matured
          ? "Matured"
          : "Active"}
      </div>
    ),
  },
];
