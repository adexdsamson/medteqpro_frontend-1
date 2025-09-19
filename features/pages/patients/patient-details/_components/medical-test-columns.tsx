"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeClasses, formatStatusText } from "@/lib/statusColors";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LabTest, formatLabDate } from "@/features/services/labResultService";

const getStatusBadge = (status: string) => {
  return (
    <Badge className={getStatusBadgeClasses(status)}>
      {formatStatusText(status)}
    </Badge>
  );
};

export const medicalTestColumns: ColumnDef<LabTest>[] = [
  {
    accessorKey: "test_date",
    header: "Date/Time",
    cell: ({ row }) => {
      const date = row.getValue("test_date") as string;
      return (
        <div className="font-medium">
          {formatLabDate(date)}
        </div>
      );
    },
  },
  {
    accessorKey: "lab_no",
    header: "Lab No.",
    cell: ({ row }) => {
      const labNo = row.getValue("lab_no") as string;
      return (
        <div className="font-medium text-blue-600">
          {labNo}
        </div>
      );
    },
  },
  {
    accessorKey: "test_type_name",
    header: "Test Type",
    cell: ({ row }) => {
      const testType = row.getValue("test_type_name") as string;
      return (
        <div className="font-medium">
          {testType}
        </div>
      );
    },
  },
  {
    accessorKey: "specimen",
    header: "Specimen",
    cell: ({ row }) => {
      const specimen = row.getValue("specimen") as string;
      return (
        <div className="text-sm text-gray-600">
          {specimen}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return getStatusBadge(status);
    },
  },
  {
    accessorKey: "ordered_by_name",
    header: "Ordered By",
    cell: ({ row }) => {
      const orderedBy = row.getValue("ordered_by_name") as string;
      return (
        <div className="text-sm text-gray-600">
          {orderedBy}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const test = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                // Handle view test details
                console.log('View test:', test.id);
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // Handle edit test
                console.log('Edit test:', test.id);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Test
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // Handle delete test
                console.log('Delete test:', test.id);
              }}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Test
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];