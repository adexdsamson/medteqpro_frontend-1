"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import Subheader from "../../../../layouts/Subheader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  useWoundRecords,
  transformWoundRecord,
  useDeleteWoundRecord,
} from "@/features/services/woundCareService";
import { useToastHandler } from "@/hooks/useToaster";
import { getStatusBadgeClasses, formatStatusText } from "@/lib/statusColors";
import { SEOWrapper } from "@/components/SEO";
import { ConfirmAlert } from "@/components/ConfirmAlert";

// Type for wound care patients in UI
interface WoundCarePatient {
  id: string;
  patientName: string;
  oraStatus: "Referred" | "Admitted";
  regDateTime: string;
}

/**
 * Admin Wound Care Management Page
 * Displays wound care records with administrative oversight capabilities
 * @returns JSX.Element
 */
const AdminWoundCarePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToastHandler();
  const deleteWoundRecord = useDeleteWoundRecord();

  // Fetch wound records from API
  const { data: woundRecords, isLoading, error } = useWoundRecords();

  /**
   * Handle delete wound record
   * @param woundId - The wound record ID to delete
   */
  const handleDelete = async (woundId: string) => {
    try {
      await deleteWoundRecord.mutateAsync(woundId);
      toast.success("Success", "Wound record deleted successfully");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete wound record";
      toast.error("Error", message);
    }
  };

  // Define columns with access to component hooks
  const columns: ColumnDef<WoundCarePatient>[] = [
    {
      accessorKey: "id",
      header: "PATIENT ID",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("id")}</span>
      ),
    },
    {
      accessorKey: "patientName",
      header: "PATIENT NAME",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("patientName")}</span>
      ),
    },
    {
      accessorKey: "oraStatus",
      header: "ORA STATUS",
      cell: ({ row }) => {
        const status = row.getValue("oraStatus") as string;
        const badgeClasses = getStatusBadgeClasses(status);
        return (
          <Badge className={badgeClasses}>{formatStatusText(status)}</Badge>
        );
      },
    },
    {
      accessorKey: "regDateTime",
      header: "REG DATE & TIME",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("regDateTime")}</span>
      ),
    },
    {
      id: "actions",
      header: "ACTION",
      cell: ({ row }) => {
        const patient = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <SquarePen className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/admin/wound-care/${patient.id}`}>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <SquarePen className="mr-2 h-4 w-4" />
                Edit Record
              </DropdownMenuItem>
              <ConfirmAlert
                title="Delete Wound Record"
                text="Are you sure you want to delete this wound record? This action cannot be undone."
                onConfirm={() => handleDelete(patient.id)}
                confirmText="Delete"
                cancelText="Cancel"
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Record
                  </DropdownMenuItem>
                }
              ></ConfirmAlert>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Transform API data to UI format
  const transformedData: WoundCarePatient[] = React.useMemo(() => {
    if (!woundRecords) return [];

    return Array.isArray(woundRecords)
      ? woundRecords.map((record) => {
          const transformed = transformWoundRecord(record);
          return {
            id: transformed.id,
            patientName: transformed.patientName,
            oraStatus: transformed.oraStatus as "Referred" | "Admitted",
            regDateTime: transformed.regDateTime,
          };
        })
      : [];
  }, [woundRecords]);

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return transformedData;

    return transformedData.filter(
      (patient) =>
        patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transformedData, searchQuery]);

  if (error) {
    toast.error("Error", "Failed to load wound care records");
  }

  return (
    <>
      <SEOWrapper
        title="Wound Care Management - SwiftPro eProcurement Portal"
        description="Administrative oversight of wound care records, patient management, and treatment tracking in the healthcare system."
        keywords="wound care, admin, patient management, healthcare administration"
        canonical="/admin/wound-care"
        robots="noindex, nofollow"
        ogImage="/assets/medteq-og-image.jpg"
        ogImageAlt="Medteq Healthcare System - Admin Wound Care Management"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Medteq Healthcare System",
        }}
      />

      <Subheader title="Wound Care Management" />

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto flex-1 sm:max-w-sm">
            <Input
              placeholder="Patient ID/Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            Generate Report
          </Button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg p-6">
          <DataTable
            columns={columns}
            data={filteredData}
            options={{
              isLoading,
              disablePagination: false,
              disableSelection: true,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default AdminWoundCarePage;
