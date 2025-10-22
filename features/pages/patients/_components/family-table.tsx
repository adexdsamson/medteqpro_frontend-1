"use client";

import React from "react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FamilyResponse } from "@/features/services/patientService";
import AddFamilyMembersDialog from "./AddFamilyMembersDialog";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface PatientTableProps {
  data: FamilyResponse[];
}

export const columns: ColumnDef<FamilyResponse>[] = [
  {
    accessorKey: "id",
    header: "FAMILY ID",
  },
  {
    accessorKey: "family_name",
    header: "FAMILY NAME",
  },
  {
    accessorKey: "no_of_members",
    header: "NUMBER OF MEMBERS",
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
      const family = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/admin/patients/${family.id}`} legacyBehavior>
              <DropdownMenuItem asChild>
                <a>Open</a>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <AddFamilyMembersDialog
              familyId={family.id}
              familyName={family.family_name}
              trigger={<div className="text-sm px-3 py-1">Add Members</div>}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const FamilyTable: React.FC<PatientTableProps> = ({ data }) => {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
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
          manualPagination: false,
          totalCounts: data?.length || 0,
          isLoading: false,
        }}
      />
    </div>
  );
};

export default FamilyTable;
