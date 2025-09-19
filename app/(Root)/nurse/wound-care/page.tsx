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
import { ConfirmAlert } from "@/components/ConfirmAlert";
import CreateWoundRecordDialog from "./_components/CreateWoundRecordDialog";
import EditWoundRecordDialog from "./_components/EditWoundRecordDialog";
import { getStatusBadgeClasses, formatStatusText } from "@/lib/statusColors";

// Type for wound care patients in UI
interface WoundCarePatient {
  id: string;
  patientName: string;
  oraStatus: "Referred" | "Admitted";
  regDateTime: string;
}

const WoundCarePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: woundRecords, isLoading, error } = useWoundRecords();
  const toast = useToastHandler();
  const deleteWoundRecord = useDeleteWoundRecord();

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
        // Map "Referred" to "pending" for consistent color scheme
        const mappedStatus =
          status === "Referred" ? "pending" : status.toLowerCase();
        return (
          <Badge className={getStatusBadgeClasses(mappedStatus)}>
            {formatStatusText(status)}
          </Badge>
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
              <Link href={`/nurse/wound-care/${patient.id}`}>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              </Link>
              <EditWoundRecordDialog woundId={patient.id}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <SquarePen className="mr-2 h-4 w-4" />
                  Edit Record
                </DropdownMenuItem>
              </EditWoundRecordDialog>
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
  const transformedPatients: WoundCarePatient[] = Array.isArray(woundRecords)
    ? woundRecords.map(transformWoundRecord)
    : [];

  // Filter patients based on search query
  const filteredPatients = transformedPatients.filter((patient) => {
    const matchesSearch =
      patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Handle API errors
  React.useEffect(() => {
    if (error) {
      toast.error("Error", "Failed to load wound care records");
    }
  }, [error, toast]);

  return (
    <>
      <Subheader title="Wound Care" />
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Patient ID/Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px]"
            />
          </div>
          <CreateWoundRecordDialog>
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              Add Record
            </Button>
          </CreateWoundRecordDialog>
        </div>

        <div className="bg-white rounded-lg p-6">
          <DataTable
            columns={columns}
            data={filteredPatients}
            options={{
              isLoading: isLoading,
              disablePagination: false,
              disableSelection: true,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default WoundCarePage;
