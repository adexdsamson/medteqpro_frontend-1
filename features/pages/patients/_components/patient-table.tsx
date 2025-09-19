"use client";

import React from "react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react"; // Using lucide-react for icons
import Link from "next/link"; // Added Link import
import { PatientListResponse } from "@/features/services/patientService";
import { format } from "date-fns";

interface PatientTableProps {
  data: PatientListResponse[];
}

export const columns: ColumnDef<PatientListResponse>[] = [
  {
    accessorKey: "user_id",
    header: "PATIENT ID",
  },
  {
    accessorKey: "full_name",
    header: "PATIENT NAME",
  },
  {
    accessorKey: "gender",
    header: "GENDER",
  },
  {
    accessorKey: "created_at",
    header: "REG DATE & TIME",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return date ? format(date, "dd-MM-yyyy HH:mm aa") : "N/A";
    },
  },
  {
    id: "actions",
    header: "ACTION",
    cell: ({ row }) => {
      // Changed to access row
      const patient = row.original;
      return (
        <Link href={`/admin/patients/${patient.id}`}>
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
    <div className="w-full max-w-[76vw] bg-white p-2">
      <DataTable
        columns={columns}
        data={data || []}
        options={{
          disableSelection: true,
          pagination: pagination,
          setPagination: setPagination,
          manualPagination: false, // Assuming client-side pagination for now
          totalCounts: data?.length || 0,
          isLoading: false, // Loading state is handled at the page level
        }}
      />
    </div>
  );
};

export default PatientTable;
