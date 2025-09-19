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

export interface DiagnosisRecord {
  id: string;
  dateTime: string;
  submittedBy: string;
  medicalDiagnosis: string;
  note?: string;
  hasNote: boolean;
}

export const columns: ColumnDef<DiagnosisRecord>[] = [
  {
    accessorKey: "dateTime",
    header: "DATE & TIME",
  },
  {
    accessorKey: "submittedBy",
    header: "SUBMITTED BY",
  },
  {
    accessorKey: "medicalDiagnosis",
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