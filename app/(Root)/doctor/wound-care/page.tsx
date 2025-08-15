"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import Subheader from "../../_components/Subheader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { useWoundRecords, transformWoundRecord } from "@/features/services/woundCareService";
import { useToastHandler } from "@/hooks/useToaster";
import CreateWoundRecordDialog from "./_components/CreateWoundRecordDialog";
import EditWoundRecordDialog from "./_components/EditWoundRecordDialog";

// Type for wound care patients in UI
interface WoundCarePatient {
  id: string;
  patientName: string;
  oraStatus: "Referred" | "Admitted";
  regDateTime: string;
}

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
      return (
        <Badge
          variant={status === "Admitted" ? "default" : "secondary"}
          className={`${
            status === "Admitted"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }`}
        >
          {status}
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
            <EditWoundRecordDialog id={patient.id}>
               <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Record</DropdownMenuItem>
             </EditWoundRecordDialog>
            <DropdownMenuItem>Delete Record</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const WoundCarePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToastHandler();
  
  // Fetch wound records from API
  const { data: woundRecords, isLoading, error } = useWoundRecords();
  
  // Transform API data to UI format
  const transformedPatients: WoundCarePatient[] = Array.isArray(woundRecords) ? woundRecords.map(transformWoundRecord) : [];
  
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