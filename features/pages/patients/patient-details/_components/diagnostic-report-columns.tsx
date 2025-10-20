"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DiagnosisRecord } from "@/features/services/diagnosticReportService";


export const columns: ColumnDef<DiagnosisRecord>[] = [
  {
    accessorKey: "created_at",
    header: "DATE & TIME",
    cell: ({ row }) => {
      const record = row.original;
      if (!record.created_at) {
        return <span>N/A</span>;
      }
      return <span>{new Date(record.created_at).toLocaleString() || "N/A"}</span>;
    },
  },
  {
    accessorKey: "recorded_by",
    header: "SUBMITTED BY",
  },
  {
    accessorKey: "diagnosis",
    header: "MEDICAL DIAGNOSIS",
  },
  {
    accessorKey: "note",
    header: "NOTE",
    cell: ({ row }) => {
      const record = row.original;
      return record.hasNote ? (
        <a href="#" className="text-blue-600 hover:underline">View Note</a>
      ) : (
        <span>N/A</span>
      );
    },
  },
  {
    id: "actions",
    header: "ACTION",
    cell: ({ row }) => {
      const record = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Pencil className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(record.id)}
            >
              Edit Record
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];