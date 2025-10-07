"use client";

import React from "react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react"; // Using lucide-react for icons
import Link from "next/link"; // Added Link import
import { PatientListResponse } from "@/features/services/patientService";
import { format } from "date-fns";
import PatientShareDialog from "./PatientShareDialog";
import { storeFunctions } from "@/store/authSlice"; // Auth store for role-based routing
import { buildRolePath, hasPatientsRoute } from "@/lib/utils"; // Centralized routing utilities

interface PatientTableProps {
  data: PatientListResponse[];
}

/**
 * Column configuration for PatientTable with role-aware action links.
 * @remarks The action column adapts the patient details route based on the authenticated user's role.
 */
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
      const patient = row.original;
      const role = storeFunctions.getState().user?.role;

      if (!hasPatientsRoute(role)) {
        return (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            disabled
            title="Access restricted"
            aria-disabled
          >
            <Edit className="h-4 w-4" />
          </Button>
        );
      }

      const href = buildRolePath(role, ["patients", String(patient.id)]) ?? "#";
      
      return (
        <div className="flex items-center gap-1">
          <Link href={href} prefetch={false}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              aria-label={`View patient ${patient.id}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <PatientShareDialog
            patientId={patient.id}
            patientUserId={patient.user_id}
            fullName={patient.full_name}
          />
        </div>
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
