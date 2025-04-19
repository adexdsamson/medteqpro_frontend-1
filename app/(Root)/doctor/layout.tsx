import React from "react";
import { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/Sidebar";
import { AppHeader } from "../_components/AppHeader";

export const metadata: Metadata = {
  title: "Doctor Portal | MedTeqPro",
  description: "Doctor dashboard and patient management",
};

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar moduleKey="doctor" />
      <main className="w-full bg-gray-50">
        <AppHeader />
        {children}
      </main>
    </SidebarProvider>
  );
} 