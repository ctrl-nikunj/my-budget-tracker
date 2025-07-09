import { TrendingDownIcon, TrendingUpIcon, MinusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";
import { useTxnRefresh } from "@/lib/store/useTxnRefresh";

export default function SectionCards() {
  const refreshTxn = useTxnRefresh((s) => s.refreshTxn);
  const [revenue, setRevenue] = useState({
    value: 0,
    trend: "steady",
    percentChange: 0,
    message: "No significant change",
  });
  const [expenses, setExpenses] = useState({
    value: 0,
    trend: "steady",
    percentChange: 0,
    message: "No significant change",
  });
  const [emi, setEMI] = useState({
    value: 0,
    trend: "steady",
    percentChange: 0,
    message: "No significant change",
  });
  const [savings, setSavings] = useState({
    value: 0,
    trend: "steady",
    percentChange: 0,
    message: "No significant change",
  });
  // const [reminders, setReminders] = useState([]);
  // const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/transactions/stats");
        // const remindersRes = await api.get("/reminders/recent");
        // const transactionsRes = await api.get("/transactions/recent");
        const data = res.data;

        setRevenue(data.income);
        setExpenses(data.expense);
        setEMI(data.emi);
        setSavings(data.savings);
        // setReminders(remindersRes.data);
        // setTransactions(transactionsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [refreshTxn]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 px-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6 font-inter">
      <Card className="@container/card flex flex-col justify-between bg-gradient-to-t from-primary/5 to-card dark:bg-card">
        <CardHeader className="items-start relative">
          <CardDescription>Total Income</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            ₹ {revenue ? revenue.value.toLocaleString() : "0.00"}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge
              variant="outline"
              className={`flex gap-1 rounded-lg text-xs ${
                revenue.trend === "up"
                  ? "text-green-600"
                  : revenue.trend === "down"
                  ? "text-red-600"
                  : "text-muted-foreground"
              }`}
            >
              {revenue.trend === "up" && <TrendingUpIcon className="size-3" />}
              {revenue.trend === "down" && (
                <TrendingDownIcon className="size-3" />
              )}
              {revenue.trend === "steady" && <MinusIcon className="size-3" />}
              {revenue.trend === "up" ? "+" : "-"}
              {revenue.percentChange}%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm ">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {revenue.message}
            {revenue.trend === "up" && (
              <TrendingUpIcon className="size-4 text-green-600" />
            )}
            {revenue.trend === "down" && (
              <TrendingDownIcon className="size-4 text-red-600" />
            )}
          </div>
          <div className="text-muted-foreground">Compared to last month</div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card dark:bg-card">
        <CardHeader className="relative">
          <CardDescription>Total Expenses</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            ₹ {expenses ? expenses.value.toLocaleString() : "0.00"}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge
              variant="outline"
              className={`flex gap-1 rounded-lg text-xs ${
                expenses.trend === "down"
                  ? "text-green-600"
                  : expenses.trend === "up"
                  ? "text-red-600"
                  : "text-muted-foreground"
              }`}
            >
              {expenses.trend === "up" && <TrendingUpIcon className="size-3" />}
              {expenses.trend === "down" && (
                <TrendingDownIcon className="size-3" />
              )}
              {expenses.trend === "steady" && <MinusIcon className="size-3" />}
              {expenses.trend === "up" ? "+" : "-"}
              {expenses.percentChange}%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start justify-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {expenses.message}
            {expenses.trend === "up" && (
              <TrendingUpIcon className="size-4 text-red-600" />
            )}
            {expenses.trend === "down" && (
              <TrendingDownIcon className="size-4 text-green-600" />
            )}
          </div>
          <div className="text-muted-foreground">Compared to last month</div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card dark:bg-card">
        <CardHeader className="relative">
          <CardDescription>Total EMIs</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            ₹ {emi ? emi.value.toLocaleString() : "0.00"}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge
              variant="outline"
              className={`flex gap-1 rounded-lg text-xs ${
                emi.trend === "down"
                  ? "text-green-600"
                  : emi.trend === "up"
                  ? "text-red-600"
                  : "text-muted-foreground"
              }`}
            >
              {emi.trend === "up" && <TrendingUpIcon className="size-3" />}
              {emi.trend === "down" && <TrendingDownIcon className="size-3" />}
              {emi.trend === "steady" && <MinusIcon className="size-3" />}
              {emi.trend === "up" ? "+" : "-"}
              {emi.percentChange}%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start justify-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {emi.message}
            {emi.trend === "up" && (
              <TrendingUpIcon className="size-4 text-red-600" />
            )}
            {emi.trend === "down" && (
              <TrendingDownIcon className="size-4 text-green-600" />
            )}
          </div>
          <div className="text-muted-foreground">Compared to last month</div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card dark:bg-card">
        <CardHeader className="relative">
          <CardDescription>Total Savings</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            ₹ {savings ? savings.value.toLocaleString() : "0.00"}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge
              variant="outline"
              className={`flex gap-1 rounded-lg text-xs ${
                savings.trend === "up"
                  ? "text-green-600"
                  : savings.trend === "down"
                  ? "text-red-600"
                  : "text-muted-foreground"
              }`}
            >
              {savings.trend === "up" && <TrendingUpIcon className="size-3" />}
              {savings.trend === "down" && (
                <TrendingDownIcon className="size-3" />
              )}
              {savings.trend === "steady" && <MinusIcon className="size-3" />}
              {savings.trend === "up" ? "+" : "-"}
              {savings.percentChange}%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start justify-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {savings.message}
            {savings.trend === "up" && (
              <TrendingUpIcon className="size-4 text-green-600" />
            )}
            {savings.trend === "down" && (
              <TrendingDownIcon className="size-4 text-red-600" />
            )}
          </div>
          <div className="text-muted-foreground">Compared to last month</div>
        </CardFooter>
      </Card>
    </div>
  );
}
