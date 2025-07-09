import React, { useEffect, useState, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
const ChartAreaInteractive = React.lazy(() =>
  import("@/components/chart-area-interactive")
);
const DataTable = React.lazy(() => import("@/components/data-table"));
const SectionCards = React.lazy(() => import("@/components/section-cards"));
import DashboardLayout from "./layout/DashboardLayout";

export default function DashboardPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <DashboardLayout name="Dashboard">
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
                  {[...Array(4)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className=" h-[197px] w-full rounded-xl"
                    />
                  ))}
                </div>
              }
            >
              <SectionCards />
            </Suspense>

            <Suspense
              fallback={
                <div className="px-4 lg:px-6">
                  <Skeleton className="h-[300px] w-full rounded-xl" />
                </div>
              }
            >
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
            </Suspense>

            <Suspense
              fallback={
                <div className="px-4 lg:px-6">
                  <Skeleton className="h-[400px] w-full rounded-xl" />
                </div>
              }
            >
              <DataTable />
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
