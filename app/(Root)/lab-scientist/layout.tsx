import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../../../layouts/Sidebar";
import { AppHeader } from "../../../layouts/AppHeader";

export default function LabScientistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-gray-50">
        <AppHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}