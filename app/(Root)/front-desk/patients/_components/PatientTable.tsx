"use client";

import React from "react";
import { DataTable } from "@/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import type { PatientType } from "@/app/(Root)/admin/patients/_components/patient-data";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import { useModule } from "@/hooks/useModule";

interface PatientTableProps {
  data: PatientType[];
}

const buildColumns = (getModulePath: (path: string) => string): ColumnDef<PatientType>[] => [
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
    accessorKey: "email",
    header: "EMAIL",
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
    cell: ({ row }) => {
      const patient = row.original;
      const href = getModulePath(`/patients/${patient.patientId}`);
      return (
        <Link href={href}>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
      );
    },
  },
];

const PatientTable: React.FC<PatientTableProps> = ({ data }) => {
  const { getModulePath } = useModule();

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <DataTable
      columns={buildColumns(getModulePath)}
      data={data || []}
      options={{
        disableSelection: true,
        pagination: pagination,
        setPagination: setPagination,
        manualPagination: false,
        totalCounts: data?.length || 0,
        isLoading: false,
      }}
    />
  );
};

export default PatientTable;