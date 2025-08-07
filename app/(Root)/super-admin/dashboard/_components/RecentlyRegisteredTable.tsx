"use client";

import React from "react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

type Hospital = {
  id: string;
  name: string;
  email: string;
  hospitalName: string;
  numberOfDoctors: string;
  dateRegistered: string;
  location: string;
  status: string;
};

interface RecentlyRegisteredTableProps {
  hospitals?: Hospital[];
  isLoading?: boolean;
}

export function RecentlyRegisteredTable({
  hospitals = [],
  isLoading = false,
}: RecentlyRegisteredTableProps) {

  const columns: ColumnDef<Hospital>[] = [
    // {
    //   accessorKey: "id",
    //   header: "ID",
    // },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "hospitalName",
      header: "Hospital Name",
    },
    {
      accessorKey: "numberOfDoctors",
      header: "Number of Doctors",
    },
    {
      accessorKey: "dateRegistered",
      header: "Date Registered",
      cell: ({ row }) => {
        const value = row.getValue("dateRegistered") as string;
        return value ? format(value, "yyyy LLL dd") : "-";
      }
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              status === "active"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="">
      <DataTable
        data={hospitals}
        columns={columns}
        options={{
          isLoading,
          disablePagination: true,
          disableSelection: true,
        }}
      />
    </div>
  );
}
