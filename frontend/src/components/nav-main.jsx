import { LoaderIcon, PlusCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { TransactionForm, ReminderForm, FDForm } from "./QuickForm";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import api from "@/lib/api";
import { useRefreshStore } from "@/lib/refreshStore";
import { Suspense } from "react";

export function NavMain({ items }) {
  const { triggerTxnRefresh, triggerRemindersRefresh, triggerFdsRefresh } =
    useRefreshStore();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [banks, setBanks] = useState([]);
  const [types, setTypes] = useState("transactions");
  const [transaction, setTransaction] = useState({
    amount: "",
    note: "",
    transaction_date: new Date().toISOString().split("T")[0],
    category: "",
    type: "income",
  });
  const [reminder, setReminder] = useState({
    title: "",
    transaction_id: null,
    due_date: new Date().toISOString().split("T")[0],
    status: "pending",
    amount: "",
    note: "",
  });
  const [fd, setFd] = useState({
    principal: "",
    interest_rate: "",
    start_date: new Date().toISOString().split("T")[0],
    duration_months: "",
    bank_id: "",
  });

  useEffect(() => {
    api.get("/transactions/recent").then((res) => setTransactions(res.data));
    api.get("/bank").then((res) => setBanks(res.data));
  }, []);

  const filteredTxns = useMemo(
    () =>
      transactions.filter((txn) => !["income", "savings"].includes(txn.type)),
    [transactions]
  );

  const filteredBank = useMemo(
    () =>
      banks.filter(
        (bank) =>
          bank.is_active !== false && bank.account_type === "fixed_deposit"
      ),
    [banks]
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setTimeout(() => setDialogOpen(true), 50);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (types === "transactions") {
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
    } else if (types === "reminders") {
      if (
        !reminder.amount ||
        !reminder.title ||
        !reminder.due_date ||
        !reminder.status
      ) {
        toast.warning("Please fill in all required fields.");
        return;
      }

      if (isNaN(reminder.amount) || parseFloat(reminder.amount) <= 0) {
        toast.warning("Amount must be a valid positive number.");
        return;
      }
      try {
        setLoading(true);
        const payload = {
          ...reminder,
          amount: parseFloat(reminder.amount),
          transaction_id: reminder.transaction_id || null,
        };
        console.log(payload);
        const res = await api.post("/reminders/add", payload);
        if (res.status === 201) {
          triggerRemindersRefresh();
          toast.success("Reminder created successfully!");
          setReminder({
            title: "",
            transaction_id: null,
            due_date: new Date().toISOString().split("T")[0],
            status: "pending",
            amount: "",
            note: "",
          });
        }
      } catch (err) {
        console.error("Error creating reminder:", err);
        toast.error("Failed to create reminder");
      } finally {
        setLoading(false);
      }
    } else if (types === "fixed deposit") {
      if (
        !fd.principal ||
        !fd.interest_rate ||
        !fd.start_date ||
        !fd.duration_months ||
        !fd.bank_id
      ) {
        toast.warning("Please fill in all required fields.");
        return;
      }

      if (isNaN(fd.principal) || parseFloat(fd.principal) <= 0) {
        toast.error("Principal must be a valid positive number.");
        return;
      }
      try {
        setLoading(true);
        const payload = {
          ...fd,
          principal: parseFloat(fd.principal),
          transaction_id: fd.bank_id || null,
        };
        console.log(payload);
        const res = await api.post("/fds/add", payload);
        if (res.status === 201) {
          triggerFdsRefresh();
          toast.success("FD created successfully!");
          setFd({
            principal: "",
            interest_rate: "",
            start_date: new Date().toISOString().split("T")[0],
            duration_months: "",
            bank_id: null,
          });
        }
      } catch (err) {
        console.error("Error creating fd:", err);
        toast.error("Failed to create fd");
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <SidebarGroup>
      <SidebarGroupContent className="font-inter flex flex-col gap-6">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Dialog
              open={isDialogOpen}
              onOpenChange={setDialogOpen}
            >
              <form>
                <DialogTrigger asChild>
                  <SidebarMenuButton
                    variant="outline"
                    tooltip="Quick Create"
                    className="w-auto bg-primary text-primary-foreground transition-colors duration-150 active:bg-primary/90 active:text-primary-foreground"
                  >
                    <PlusCircleIcon className="w-4 h-4" />
                    <span>Create</span>

                    <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                      <span className="text-xs">Ctrl</span>K
                    </kbd>
                  </SidebarMenuButton>
                </DialogTrigger>
                {isDialogOpen && (
                  <Suspense
                    fallback={
                      <div className="flex items-center gap-2">
                        <LoaderIcon className="animate-spin w-4 h-4" />
                        Loading...
                      </div>
                    }
                  >
                    <DialogContent className="w-[--radix-dialog-content-width] max-w-md mx-auto p-6 px-4 sm:px-6 md:px-8 rounded-lg overflow-visible font-inter">
                      <DialogHeader>
                        <DialogTitle>
                          Create New{" "}
                          {types === "transactions"
                            ? "Transaction"
                            : types === "reminders"
                            ? "Reminder"
                            : "Fixed Deposit Entry"}
                        </DialogTitle>
                        <DialogDescription>
                          Enter the necessary details to create a new{" "}
                          {types === "transactions"
                            ? "Transaction"
                            : types === "reminders"
                            ? "Reminder"
                            : "Fixed Deposit Entry"}
                          .<br /> Click 'Save' to confirm.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4">
                        <Tabs
                          value={types}
                          onValueChange={(val) => setTypes(val)}
                          defaultValue="transactions"
                          className="w-auto flex flex-col items-center gap-4"
                        >
                          <TabsList>
                            <TabsTrigger value="transactions">
                              Transactions
                            </TabsTrigger>
                            <TabsTrigger value="reminders">
                              Reminders
                            </TabsTrigger>
                            <TabsTrigger value="fds">FDs</TabsTrigger>
                          </TabsList>

                          <TabsContent value="transactions">
                            <TransactionForm
                              transaction={transaction}
                              setTransaction={setTransaction}
                            />
                          </TabsContent>

                          <TabsContent value="reminders">
                            <ReminderForm
                              reminder={reminder}
                              setReminder={setReminder}
                              filteredTxns={filteredTxns}
                            />
                          </TabsContent>

                          <TabsContent value="fds">
                            <FDForm
                              fd={fd}
                              setFd={setFd}
                              filteredBank={filteredBank}
                            />
                          </TabsContent>
                        </Tabs>
                      </div>

                      <DialogFooter>
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
                      </DialogFooter>
                    </DialogContent>
                  </Suspense>
                )}
              </form>
            </Dialog>

            {/* <Button
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button> */}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
              >
                <Link to={item.url}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
