"use client";

import * as React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useTxnRefresh } from "@/lib/store/useTxnRefresh";

const typeConfig = {
  Income: { color: "#00bcd4" },
  Expenses: { color: "#f44336" },
  Savings: { color: "#4caf50" },
  EMI: { color: "#9c27b0" },
  Credit: { color: "#ff9800" },
};

export default function ChartAreaInteractive() {
  const refreshTxn = useTxnRefresh((s) => s.refreshTxn);
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");
  const [chartData, setChartData] = React.useState([]);
  const [selectedTypes, setSelectedTypes] = React.useState([
    "Income",
    "Expenses",
    "Savings",
    "EMI",
    "Credit",
  ]);

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  React.useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await api.get(`/analytics/chart?range=${timeRange}`);
        setChartData(res.data);
      } catch (err) {
        console.error("Error fetching chart data:", err?.message);
      }
    };
    fetchdata();
  }, [timeRange, refreshTxn]);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // const filteredData = chartData.filter((item) => {
  //   const date = new Date(item.date);
  //   const referenceDate = new Date("2024-06-30");
  //   let daysToSubtract = 90;
  //   if (timeRange === "30d") {
  //     daysToSubtract = 30;
  //   } else if (timeRange === "7d") {
  //     daysToSubtract = 7;
  //   }
  //   const startDate = new Date(referenceDate);
  //   startDate.setDate(startDate.getDate() - daysToSubtract);
  //   return date >= startDate;
  // });

  return (
    <Card className="@container/card font-inter">
      <CardHeader className="relative">
        {/* Title Row with Controls */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Net Summary</CardTitle>
            <CardDescription className="mt-1">
              <span className="@[540px]/card:block hidden">
                {timeRange === "7d" && "Last 7 Days"}
                {timeRange === "30d" && "Last 30 Days"}
                {timeRange === "90d" && "Last 3 Months"}
              </span>
              <span className="@[540px]/card:hidden">
                {timeRange === "7d" && "Last 7 Days"}
                {timeRange === "30d" && "Last 30 Days"}
                {timeRange === "90d" && "Last 3 Months"}
              </span>
            </CardDescription>
          </div>

          {/* Time Range Controls */}
          <div className="flex-shrink-0">
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger
                className="w-36 h-8 text-sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem
                  value="90d"
                  className="rounded-lg"
                >
                  Last 3 months
                </SelectItem>
                <SelectItem
                  value="30d"
                  className="rounded-lg"
                >
                  Last 30 days
                </SelectItem>
                <SelectItem
                  value="7d"
                  className="rounded-lg"
                >
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={typeConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ChartLegend className="mb-2 flex flex-col items-start" />
          <LineChart data={chartData}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
            />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(val) => val}
                  indicator="dot"
                />
              }
              className="flex flex-col items-start"
            />
            {selectedTypes.length === 0 ? (
              <Line
                type="monotone"
                dataKey="dummy"
                stroke="#ccc"
                strokeWidth={2}
                strokeDasharray="5 5"
                isAnimationActive={true}
                animationDuration={500}
                dot={false}
                activeDot={false}
              />
            ) : (
              selectedTypes.map((type) => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  stroke={typeConfig[type].color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        {/* Checkboxes Row */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {Object.keys(typeConfig).map((type) => (
            <Label
              key={type}
              className="flex items-center gap-1.5 text-sm whitespace-nowrap cursor-pointer"
            >
              <Checkbox
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => toggleType(type)}
                className="w-4 h-4 accent-zinc-500 hover:accent-zinc-600 focus:accent-zinc-700"
              />
              <span style={{ color: typeConfig[type].color }}>{type}</span>
            </Label>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
