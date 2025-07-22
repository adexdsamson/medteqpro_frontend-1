import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/Sidebar";
import { AppHeader } from "../_components/AppHeader";

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