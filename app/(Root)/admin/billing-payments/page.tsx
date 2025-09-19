"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Subheader from "../../../../layouts/Subheader";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { TextInput, TextInputProps } from "@/components/FormInputs/TextInput";
import { DataTable } from "@/components/DataTable";
import { Forge, FormPropsRef, useForge, FieldProps } from "@/lib/forge";
import { SEOWrapper } from "@/components/SEO";
import { billColumns, BillRow } from "./_components/columns";
import CreateBillDialog from "./_components/CreateBillDialog";
import { PaginationState } from "@tanstack/react-table";

// Data will be sourced from API; placeholder empty array until endpoints are wired
const sourceData: BillRow[] = [];

export default function AdminBillingPaymentsPage() {
  const [search, setSearch] = useState("");
  const formRef = useRef<FormPropsRef | null>(null);

  const fields: FieldProps<TextInputProps>[] = [
    {
      name: "search",
      label: "",
      type: "text",
      placeholder: "Patient ID/Name",
      containerClass: "w-full sm:w-60",
      component: TextInput,
      // removed showLabel to avoid passing to DOM
      startAdornment: <SearchIcon className="h-4 w-4 text-gray-400" />,
      // inputClassName: "pl-10 min-h-[44px] sm:min-h-[48px]",
    },
  ];

  const { control } = useForge<{ search: string }>({
    fields,
    defaultValues: { search: "" },
  });

  const handleSubmit = (data: { search: string }) => setSearch(data.search);

  // Manual pagination state for DataTable
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Reset to first page on search term change
  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [search]);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    const base = sourceData;
    if (!s) return base;
    return base.filter(
      (r) =>
        r.patientId.toLowerCase().includes(s) ||
        r.patientName.toLowerCase().includes(s)
    );
  }, [search]);

  // Slice data according to current page
  const paged = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return filtered.slice(start, start + pagination.pageSize);
  }, [filtered, pagination]);

  return (
    <>
      <SEOWrapper
        title="Billing & Payments - SwiftPro eProcurement Portal"
        description="Create and manage patient bills, track payments, and review balances in the Admin Billing module."
        keywords="billing, payments, invoices, patient billing, hospital admin"
        canonical="/admin/billing-payments"
        robots="noindex, nofollow"
        ogImage="/assets/medteq-og-image.jpg"
        ogImageAlt="Medteq Healthcare System - Billing & Payments"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Medteq Healthcare System",
        }}
      />

      <Subheader title="Billing & Payments" />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="w-full sm:w-auto flex-1 sm:max-w-md">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Search Keyword
            </p>
            <Forge
              ref={formRef}
              control={control}
              className="flex items-center w-full gap-3"
              onSubmit={handleSubmit}
            />
          </div>

          <CreateBillDialog>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white min-h-[44px] sm:min-h-[48px] touch-manipulation">
              Create New Bill
            </Button>
          </CreateBillDialog>
        </div>

        <div className="bg-white p-1.5 rounded-lg shadow overflow-auto max-w-[76vw]">
          <DataTable
            columns={billColumns}
            data={paged}
            options={{
              disableSelection: true,
              isLoading: false,
              pagination,
              setPagination,
              totalCounts: filtered.length,
              manualPagination: true,
            }}
          /> 
        </div>
      </div>
    </>
  );
}