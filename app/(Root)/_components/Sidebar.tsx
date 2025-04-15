'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  HelpCircle,
  UserCog,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  
  // Function to check if the current path matches the menu item's href
  const isItemActive = (href: string) => {
    // Check if the current path starts with the super-admin prefix and the href
    return pathname?.startsWith(`/super-admin${href}`);
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      label: "Clients Management",
      icon: Users,
      href: "/clients",
    },
    {
      label: "Staff Management",
      icon: Users,
      href: "/staff",
    },
    {
      label: "System Settings",
      icon: Settings,
      href: "/settings",
    },
    {
      label: "Reports",
      icon: FileText,
      href: "/reports",
    },
    {
      label: "Support",
      icon: HelpCircle,
      href: "/support",
    },
  ];

  const menuItems2 = [
    {
      label: "Profile Settings",
      icon: UserCog,
      href: "/profile",
      
    },
    {
      label: 'Logout',
      icon: LogOut,
      href: '/sign-out'
    }
  ]

  return (
    <Sidebar className="!bg-white">
      <SidebarHeader className="p-4">
        <div className="flex items-center">
          <span className="text-xl font-bold text-primary mx-auto">
            <span className="text-[#16232E]">Medteq</span>
            <span className="text-[#16C2D5]">Pro</span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    className="h-10 text-sm font-semibold" 
                    isActive={isItemActive(item.href)} 
                    asChild>
                    <Link href={`/super-admin${item.href}`}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel>SETTINGS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems2.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    className="h-10 text-sm font-semibold" 
                    isActive={isItemActive(item.href)} 
                    asChild>
                    <Link href={`/super-admin${item.href}`}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
