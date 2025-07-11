import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChartIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  HandCoinsIcon,
  SearchIcon,
  SettingsIcon,
  FileInput,
  FileOutput,
} from "lucide-react";
import { FaMoneyBill, FaTasks, FaFileInvoice } from "react-icons/fa";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { logoutUser } from "@/lib/auth/logout";
import api from "@/lib/api";

// 👇 Memoized static nav structure outside the component
const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "FDs",
      url: "/fds",
      icon: HandCoinsIcon,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: FaMoneyBill,
    },
    {
      title: "Reminders",
      url: "/reminders",
      icon: FaTasks,
    },
  ],
  collapse: [
    {
      title: "Invoice",
      url: "#",
      items: [
        { title: "Sales", url: "/invoice/sales", icon: FileInput },
        {
          title: "Purchase",
          url: "/invoice/purchase",
          icon: FileOutput,
        },
      ],
      icon: FaFileInvoice,
    },
  ],
  navSecondary: [
    { title: "Settings", url: "#", icon: SettingsIcon },
    { title: "Get Help", url: "#", icon: HelpCircleIcon },
    { title: "Search", url: "#", icon: SearchIcon },
  ],
};

const AppSidebar = React.memo(function AppSidebar(props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me", { withCredentials: true });
        if (res.data.name !== username) setUsername(res.data.name);
        if (res.data.email !== email) setEmail(res.data.email);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [username, email]);

  const handleLogout = useCallback(async () => {
    await logoutUser();
    navigate("/login");
  }, [navigate]);

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="w-10"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="flex items-center ">
                <div className="w-9 h-9 rounded-full flex items-center justify-center">
                  <img src="./Logo.png"></img>
                </div>
                <span className="text-2xl font-semibold text-zinc-700">
                  Paylert
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navData.navMain} collapse={navData.collapse}  />
        <NavSecondary items={navData.navSecondary} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          email={email}
          username={username}
          handleLogout={handleLogout}
          className="font-inter"
        />
      </SidebarFooter>
    </Sidebar>
  );
});

export default AppSidebar;
