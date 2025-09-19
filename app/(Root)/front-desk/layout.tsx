import React from "react";
import { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../../../layouts/Sidebar";
import { AppHeader } from "../../../layouts/AppHeader";

export const metadata: Metadata = {
  title: "Front Desk Portal | MedTeqPro",
  description: "Front desk management system for patient registration, queuing, and appointments",
};

export default function FrontDeskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar moduleKey="front-desk" />
      <main className="w-full bg-gray-50">
        <AppHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}