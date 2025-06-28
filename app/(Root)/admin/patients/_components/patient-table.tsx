"use client";

import React from "react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { PatientType } from "./patient-data";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react"; // Using lucide-react for icons
import Link from "next/link"; // Added Link import

interface PatientTableProps {
  data: PatientType[];
}

export const columns: ColumnDef<PatientType>[] = [
  {
    accessorKey: "patientId",
    header: "PATIENT ID",
  },
  {
    accessorKey: "name",
    header: "PATIENT NAME",
  },
  {
    accessorKey: "gender",
    header: "GENDER",
  },
  {
    accessorKey: "age",
    header: "AGE",
  },
  {
    accessorKey: "lastVisit",
    header: "LAST VISIT",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status;
      let statusClass = "";
      switch (status) {
        case "Active":
          statusClass = "bg-green-100 text-green-700";
          break;
        case "Inactive":
          statusClass = "bg-yellow-100 text-yellow-700";
          break;
        case "Deceased":
          statusClass = "bg-red-100 text-red-700";
          break;
        case "Critical":
          statusClass = "bg-orange-100 text-orange-700";
          break;
        case "Recovered":
          statusClass = "bg-blue-100 text-blue-700";
          break;
        default:
          statusClass = "bg-gray-100 text-gray-700";
      }
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "ACTION",
    cell: ({ row }) => { // Changed to access row
      const patient = row.original;
      return (
        <Link href={`/admin/patients/${patient.patientId}/add-vital-signs`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
      );
    },
  },
];

const PatientTable: React.FC<PatientTableProps> = ({ data }) => {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10, // Default page size
  });

  return (
    <DataTable
      columns={columns}
      data={data || []}
      options={{
        disableSelection: true,
        pagination: pagination,
        setPagination: setPagination,
        manualPagination: false, // Assuming client-side pagination for now
        totalCounts: data?.length || 0,
        isLoading: false // Loading state is handled at the page level
      }}
    />
  );
};

export default PatientTable;