import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  LayoutDashboardIcon,
  HandCoinsIcon,
  BarChartIcon,
  FolderIcon,
  UsersIcon,
  SettingsIcon,
  HelpCircleIcon,
  SearchIcon,
} from "lucide-react";

const AppSidebarSkeleton = () => {
  return (
    <Sidebar
      collapsible="icon"
      className="w-10"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <span className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                <Skeleton className="h-4 w-20" />
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <div className="space-y-4">
          {[
            LayoutDashboardIcon,
            HandCoinsIcon,
            BarChartIcon,
            FolderIcon,
            UsersIcon,
          ].map((Icon, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2"
            >
              <Icon className="h-4 w-4 text-muted" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}

          <div className="border-t pt-4 space-y-4">
            {[SettingsIcon, HelpCircleIcon, SearchIcon].map((Icon, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2"
              >
                <Icon className="h-4 w-4 text-muted" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col gap-2 px-4 py-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-6 w-20 mt-2" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebarSkeleton;
