import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "./layout/DashboardLayout";
import { PaginatedTable } from "@/components/data-table";
import { useTxnRefresh } from "@/lib/store/useTxnRefresh";
import api from "@/lib/api";
import { TransactionForm } from "@/components/QuickForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function Transactions() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const triggerTxnRefresh = useTxnRefresh((s) => s.refreshTxn);
  const [transactions, setTransactions] = useState([]);
  const [transaction, setTransaction] = useState({
    amount: "",
    note: "",
    transaction_date: new Date().toISOString().split("T")[0],
    category: "",
    type: "income",
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !transaction.amount ||
      !transaction.category ||
      !transaction.transaction_date ||
      !transaction.type
    ) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    if (isNaN(transaction.amount) || parseFloat(transaction.amount) <= 0) {
      toast.warning("Amount must be a valid positive number.");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        ...transaction,
        amount: parseFloat(transaction.amount),
      };
      console.log(payload);
      const res = await api.post("/transactions/add", payload);
      if (res.status === 201) {
        triggerTxnRefresh();
        toast.success("Transaction created successfully!");
        setTransaction({
          amount: "",
          note: "",
          transaction_date: new Date().toISOString().split("T")[0],
          category: "",
          type: "income",
        });
      }
    } catch (err) {
      console.error("Error creating transaction:", err);
      toast.error("Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTxn = async () => {
      try {
        const result = await api.get("/transactions");
        setTransactions(result.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTxn();
    setIsVisible(true);
  }, [refreshTxn]);
  console.log(transactions);
  return (
    <DashboardLayout name="Transactions">
      <div
        className={`flex-1 overflow-y-auto transform transition-all duration-700 ease-in-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="@container/main flex flex-1 flex-col gap-2 min-w-0">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Suspense
              fallback={
                <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-1 lg:px-6 lg:grid-cols-2">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className=" h-[197px] w-full rounded-xl"
                    />
                  ))}
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 px-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6 font-inter">
                <Card className="h-[--card-width] w-full rounded-xl bg-gradient-to-t from-primary/5 to-card dark:bg-card">
                  <CardHeader>
                    <CardTitle>Manual Entry</CardTitle>
                    <CardDescription>
                      Enter the details of your transaction manually.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TransactionForm
                      transaction={transaction}
                      setTransaction={setTransaction}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full ml-auto"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <LoaderIcon className="animate-spin w-4 h-4" />
                          Saving...
                        </div>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="h-[--card-width] w-full rounded-xl bg-gradient-to-t from-primary/5 to-card dark:bg-card">
                  <CardHeader>
                    <CardTitle>Bulk Entry</CardTitle>
                    <CardDescription>
                      Upload bank statement for bulk entry
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center gap-4">
                    <div className="flex flex-row gap-4 items-center justify-center">
                      <Label>Upload </Label>
                      <Input type="file" />
                    </div>
                    <Button>Upload</Button>
                  </CardContent>
                </Card>
              </div>
            </Suspense>
            <Suspense
              fallback={
                <div className="px-4 lg:px-6">
                  <Skeleton className="h-[400px] w-full rounded-xl" />
                </div>
              }
            >
              <div className="px-4 lg:px-6">
                <PaginatedTable
                  data={transactions}
                  columns={transactionColumns}
                />
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
