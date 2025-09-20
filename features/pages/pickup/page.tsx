"use client";

import React, { useMemo, useState } from "react";
import Subheader from "@/layouts/Subheader";
import { SEOWrapper } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersTable, { type OrderRow, type PickupStatus } from "./_components/OrdersTable";
import { StatBox } from "./_components/Stats";

/**
 * Pickup Page - mirrors the visual and interaction design from the provided reference.
 * 
 * Key sections:
 * - Overview stats (Picked, Pending, Cancelled)
 * - Search bar and Book Pickup button
 * - Tabs (Individual, Family) and filters (All, Picked, Pending, Cancelled)
 * - Orders table listing
 */
/**
 * PickupPage renders the end-to-end UI for managing pickup orders.
 * It mirrors the provided reference with stat overview, search, tabs, status filters, and a responsive table.
 * @returns {JSX.Element} The pickup management page
 */
export default function PickupPage() {
  // Demo source data for table rendering; replace with API integration when available.
  const source: OrderRow[] = useMemo(
    () => [
      { id: "1", orderId: "Order-1234", patientId: "Patient-2234", gender: "female", pickupDateTime: "22-May-24 11:24AM", status: "picked" },
      { id: "2", orderId: "Order-6789", patientId: "Patient-3409", gender: "male", pickupDateTime: "22-May-24 11:24AM", status: "pending" },
      { id: "3", orderId: "Order-9012", patientId: "Patient-1023", gender: "male", pickupDateTime: "22-May-24 01:15PM", status: "cancelled" },
      { id: "4", orderId: "Order-1123", patientId: "Patient-8890", gender: "female", pickupDateTime: "23-May-24 09:00AM", status: "picked" },
    ],
    []
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PickupStatus | "all">("all");

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return source.filter((r) => {
      const matchSearch = !s || r.orderId.toLowerCase().includes(s) || r.patientId.toLowerCase().includes(s);
      const matchFilter = filter === "all" ? true : r.status === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter, source]);

  // Overview counts
  const pickedCount = source.filter((r) => r.status === "picked").length;
  const pendingCount = source.filter((r) => r.status === "pending").length;
  const cancelledCount = source.filter((r) => r.status === "cancelled").length;

  return (
    <>
      <SEOWrapper
        title="Pickup - SwiftPro eProcurement Portal"
        description="Manage and track pickup orders with filters for picked, pending, and cancelled statuses."
        keywords="pickup, orders, pending, picked, cancelled"
        canonical="/pharmacy/pickup"
        robots="noindex, nofollow"
        ogImage="/assets/medteq-og-image.jpg"
        ogImageAlt="Medteq Pickup"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Pickup",
        }}
      />

      <Subheader title="Pickup" />

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen w-full">
        <h2 className="text-sm font-medium text-gray-700">Overview</h2>
         {/* Overview */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <StatBox title="Picked" value={pickedCount} tone="success" />
           <StatBox title="Pending" value={pendingCount} tone="warning" />
           <StatBox title="Cancelled Order" value={cancelledCount} tone="danger" />
         </div>

         {/* Search & Action */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
           <div className="space-y-1">
             <label className="text-sm text-gray-600">Search Keyword</label>
            <div className="relative w-full sm:w-64">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
              <Input placeholder="Order ID" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
           </div>
           <Button className="self-start sm:self-auto">Book Pickup</Button>
         </div>

        {/* Tabs */}
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="bg-transparent gap-6">
            <TabsTrigger value="individual" className="data-[state=active]:border-b-2 data-[state=active]:border-[#16C2D5] rounded-none">Individual</TabsTrigger>
            <TabsTrigger value="family" className="data-[state=active]:border-b-2 data-[state=active]:border-[#16C2D5] rounded-none">Family</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex items-center gap-2 mt-3">
            {([
              { key: "all", label: "All" },
              { key: "picked", label: "Picked" },
              { key: "pending", label: "Pending" },
              { key: "cancelled", label: "Cancelled" },
            ] as const).map((f) => (
              <Button
                key={f.key}
                size="sm"
                variant={filter === f.key ? "default" : "outline"}
                onClick={() => setFilter(f.key as "all" | PickupStatus)}
                className="px-3"
              >
                {f.label}
              </Button>
            ))}
          </div>

          <TabsContent value="individual" className="mt-4">
            <div className="bg-white p-1.5 rounded-lg shadow overflow-auto max-w-[76vw]">
              <OrdersTable data={filtered} />
            </div>
          </TabsContent>

          <TabsContent value="family" className="mt-4">
            <div className="bg-white p-1.5 rounded-lg shadow overflow-auto max-w-[76vw]">
              <OrdersTable data={filtered} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}