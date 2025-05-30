import React from "react";
import { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/Sidebar";
import { AppHeader } from "../_components/AppHeader";

export const metadata: Metadata = {
  title: "Pharmacy Portal | MedTeqPro",
  description: "Pharmacy dashboard and medication management",
};

export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar moduleKey="pharmacy" />
      <main className="w-full bg-gray-50">
        <AppHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}