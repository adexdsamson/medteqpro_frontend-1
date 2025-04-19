import React from "react";
import { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/Sidebar";
import { AppHeader } from "../_components/AppHeader";

export const metadata: Metadata = {
  title: "Nurse Portal | MedTeqPro",
  description: "Nurse dashboard and patient care management",
};

export default function NurseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar moduleKey="nurse" />
      <main className="w-full bg-gray-50">
        <AppHeader />
        {children}
      </main>
    </SidebarProvider>
  );
} 