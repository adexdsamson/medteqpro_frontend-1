import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../../../layouts/Sidebar";
import { AppHeader } from "../../../layouts/AppHeader";
import RoutePermissionGate from "@/components/RoutePermissionGate";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-gray-50">
        <AppHeader />
        <RoutePermissionGate>
          {children}
        </RoutePermissionGate>
      </main>
    </SidebarProvider>
  );
}
