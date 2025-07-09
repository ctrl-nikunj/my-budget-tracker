import React, { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import FDInput from "@/components/fdInput";
import { LoaderIcon } from "lucide-react";

const DatePickerDemo = React.lazy(() =>
  import("@/components/ui/date-picker").then((mod) => ({
    default: mod.DatePickerDemo,
  }))
);

export function TransactionForm({ transaction, setTransaction }) {
  return (
    <div className="grid grid-cols-2 items-center gap-4">
      <Label>Amount in ₹</Label>
      <Input
        type="number"
        value={transaction.amount}
        placeholder="Enter amount"
        required
        onChange={(e) => {
          setTransaction({ ...transaction, amount: e.target.value });
        }}
      />

      <Label>Type of Transaction</Label>
      <Select
        className="w-full"
        required
        value={transaction.type}
        onValueChange={(e) => {
          setTransaction({ ...transaction, type: e });
        }}
      >
        <SelectTrigger className="w-36 h-8 text-sm">
          <SelectValue placeholder="Select the type of transaction" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="income">Income</SelectItem>
          <SelectItem value="expense">Expense</SelectItem>
          <SelectItem value="savings">Savings</SelectItem>
          <SelectItem value="emi">EMI</SelectItem>
          <SelectItem value="credit">Credit</SelectItem>
        </SelectContent>
      </Select>

      <Label>Category</Label>
      <Input
        type="text"
        value={transaction.category}
        placeholder="Enter category"
        required
        onChange={(e) => {
          setTransaction({ ...transaction, category: e.target.value });
        }}
      />

      <Label>Transaction Date</Label>
      <Suspense fallback={<div>Loading...</div>}>
        <DatePickerDemo
          value={transaction.transaction_date}
          required
          onChange={(date) => {
            setTransaction({ ...transaction, transaction_date: date });
          }}
        />
      </Suspense>

      <Label className="col-span-1">Note</Label>
      <Textarea
        value={transaction.note}
        placeholder="Enter any additional notes"
        onChange={(e) => {
          setTransaction({ ...transaction, note: e.target.value });
        }}
        className="col-span-1 resize-none"
      />
    </div>
  );
}

export function ReminderForm({ reminder, setReminder, filteredTxns }) {
  return (
    <div className="grid grid-cols-2 items-center gap-4">
      <Label>Amount in ₹</Label>
      <Input
        type="number"
        value={reminder.amount}
        placeholder="Enter amount"
        required
        onChange={(e) => {
          setReminder({ ...reminder, amount: e.target.value });
        }}
      />

      <Label>
        Link to an existing transaction{" "}
        <p className="text-muted-foreground text-sm">(optional)</p>
      </Label>
      <Select
        value={reminder.transaction_id}
        onValueChange={(val) =>
          setReminder({ ...reminder, transaction_id: val })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select related transaction (optional)" />
        </SelectTrigger>
        <SelectContent className="w-full max-w-[280px]">
          <SelectItem value="null">None</SelectItem>
          {filteredTxns.map((txn) => (
            <SelectItem
              key={txn.transaction_id}
              value={txn.transaction_id}
            >
              {new Date(txn.transaction_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              - {txn.category} - ₹{txn.amount}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>Status</Label>
      <Select
        className="w-full"
        required
        value={reminder.status}
        onValueChange={(e) => {
          setReminder({ ...reminder, status: e });
        }}
      >
        <SelectTrigger className="w-36 h-8 text-sm">
          <SelectValue placeholder="Select the status of reminder" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      <Label>Title</Label>
      <Input
        type="text"
        value={reminder.title}
        placeholder="Enter reminder title"
        required
        onChange={(e) => {
          setReminder({ ...reminder, title: e.target.value });
        }}
      />

      <Label>Due Date</Label>
      <Suspense fallback={<div>Loading...</div>}>
        <DatePickerDemo
          value={reminder.due_date}
          required
          onChange={(date) => {
            setReminder({ ...reminder, due_date: date });
          }}
        />
      </Suspense>

      <Label className="col-span-1">Note</Label>
      <Textarea
        value={reminder.note}
        placeholder="Enter any additional notes"
        onChange={(e) => {
          setReminder({ ...reminder, note: e.target.value });
        }}
        className="col-span-1 resize-none"
      />
    </div>
  );
}

export function FDForm({ fd, setFd, filteredBank }) {
  return (
    <div className="grid grid-cols-2 items-center gap-4">
      <Label>Principal in ₹</Label>
      <FDInput />
      <Label>Interest Rate in %</Label>
      <Input
        type="number"
        value={fd.interest_rate}
        placeholder="Enter interest rate"
        required
        onChange={(e) => {
          setFd({ ...fd, interest_rate: e.target.value });
        }}
      />

      <Label>Start Date</Label>
      <Suspense fallback={<LoaderIcon className="animate-spin w-4 h-4" />}>
        <DatePickerDemo
          value={fd.start_date}
          required
          onChange={(date) => {
            setFd({ ...fd, start_date: date });
          }}
        />
      </Suspense>

      <Label>Duration in months</Label>
      <Input
        type="number"
        value={fd.duration_months}
        placeholder="Enter duration in months"
        min="1"
        required
        onChange={(e) => {
          setFd({ ...fd, duration_months: e.target.value });
        }}
      />

      <Label>Bank</Label>
      <Select
        className="w-full"
        required
        value={fd.bank_id}
        onValueChange={(e) => {
          setFd({ ...fd, bank_id: e });
        }}
      >
        <SelectTrigger className="w-36 h-8 text-sm">
          <SelectValue placeholder="Select the bank account" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {filteredBank.map((bank) => (
            <SelectItem
              key={bank.id}
              value={bank.id}
              className="rounded-lg w-full"
            >
              {bank.name} - {"****" + bank.account_number.slice(-4)} -{" "}
              {bank.ifsc_code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
