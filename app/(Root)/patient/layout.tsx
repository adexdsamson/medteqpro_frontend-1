import React from "react";
import { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/Sidebar";
import { AppHeader } from "../_components/AppHeader";

export const metadata: Metadata = {
  title: "Patient Portal | MedTeqPro",
  description: "Patient dashboard and management",
};

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar moduleKey="patient" />
      <main className="w-full bg-[#F1F4F8]">
        <AppHeader />
        {children}
      </main>
    </SidebarProvider>
  );
} 