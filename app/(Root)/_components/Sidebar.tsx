import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  HelpCircle, 
  UserCog, 
  LogOut 
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center">
          <span className="text-xl font-bold text-primary">
            <span className="text-[#16232E]">Medteq</span>
            <span className="text-[#16C2D5]">Pro</span>
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>MENU</SidebarMenu>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem asChild active>
              <Link href="/super-admin/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem asChild>
              <Link href="/super-admin/clients">
                <Users className="h-4 w-4" />
                <span>Client Management</span>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem asChild>
              <Link href="/super-admin/staff">
                <Users className="h-4 w-4" />
                <span>Staff Management</span>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem asChild>
              <Link href="/super-admin/settings">
                <Settings className="h-4 w-4" />
                <span>System Settings</span>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem asChild>
              <Link href="/super-admin/reports">
                <FileText className="h-4 w-4" />
                <span>Reports</span>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem asChild>
              <Link href="/super-admin/support">
                <HelpCircle className="h-4 w-4" />
                <span>Support</span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarMenu className="mt-6">SETTINGS</SidebarMenu>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem asChild>
              <Link href="/super-admin/profile">
                <UserCog className="h-4 w-4" />
                <span>Profile Settings</span>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem asChild>
              <Link href="/sign-out" className="text-red-500 hover:text-red-600">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-muted-foreground">
        <div>© 2024 MedTeqPro. All rights reserved.</div>
      </SidebarFooter>
    </Sidebar>
  )
}
  