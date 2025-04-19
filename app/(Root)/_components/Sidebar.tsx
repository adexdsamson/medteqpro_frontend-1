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
import Link from "next/link";
import { useModule } from "@/hooks/useModule";

interface AppSidebarProps {
  moduleKey?: string;
}

export function AppSidebar({ moduleKey }: AppSidebarProps) {
  // Use our custom hook to get module configuration and utility functions
  const { moduleConfig, isActivePath, getModulePath } = useModule(moduleKey);

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
              {moduleConfig.menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    className="h-10 text-sm font-semibold" 
                    isActive={isActivePath(item.href)} 
                    asChild
                  >
                    <Link href={getModulePath(item.href)}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {moduleConfig.settingsItems && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel>SETTINGS</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {moduleConfig.settingsItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton 
                      className="h-10 text-sm font-semibold" 
                      isActive={isActivePath(item.href)} 
                      asChild
                    >
                      <Link href={getModulePath(item.href)}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
