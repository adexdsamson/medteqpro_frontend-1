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
import Image from "next/image";
import { useModule } from "@/hooks/useModule";
import { storeFunctions } from "@/store/authSlice";
import { useRouter } from "next/navigation";

interface AppSidebarProps {
  moduleKey?: string;
}

export function AppSidebar({ moduleKey }: AppSidebarProps) {
  // Use our custom hook to get module configuration and utility functions
  const { moduleConfig, isActivePath, getModulePath } = useModule(moduleKey);
  const router = useRouter();

  const handleLogout = () => {
    try {
      storeFunctions.getState().setReset();
    } finally {
      router.push("/sign-in");
    }
  };

  return (
    <Sidebar variant="sidebar" className="!bg-white">
      <SidebarHeader className="p-4">
        <div className="flex items-center">
          <Image
            src="/Medteqpro.svg"
            alt="MedteqPro"
            width={140}
            height={32}
            priority
            className="mx-auto h-8 w-auto"
          />
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
                      <item.icon className={`h-5 w-5 ${isActivePath(item.href) ? "text-[#118795]":"text-[#9CA6CB]"}`} />
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
                    {item.action === "logout" ? (
                      <SidebarMenuButton
                        className="h-10 text-sm font-semibold"
                        isActive={false}
                        onClick={handleLogout}
                      >
                        <item.icon className="h-5 w-5 text-red-600" />
                        <span className="text-red-600">{item.label}</span>
                      </SidebarMenuButton>
                    ) : (
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
                    )}
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
