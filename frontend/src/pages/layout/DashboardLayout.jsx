// src/layouts/DashboardLayout.jsx
import React from "react";
import AppSidebarSkeleton from "@/components/skeletons/AppSidebarSkeleton";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
const AppSidebar = React.lazy(() => import("@/components/app-sidebar"));
const SiteHeader = React.lazy(() => import("@/components/site-header"));

export default function DashboardLayout({ children, name }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <React.Suspense fallback={<AppSidebarSkeleton />}>
          <AppSidebar variant="inset" />
        </React.Suspense>
        <SidebarInset className="flex flex-1 flex-col overflow-hidden">
          <React.Suspense fallback={<Skeleton className="h-16 w-full" />}>
            <SiteHeader name={name} />
          </React.Suspense>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
