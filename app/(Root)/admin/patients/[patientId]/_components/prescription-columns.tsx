"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PrescriptionType } from "@/features/services/prescriptionService";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const prescriptionColumns: ColumnDef<PrescriptionType>[] = [
  {
    accessorKey: "formattedCreatedAt",
    header: "DATE & TIME",
    cell: ({ row }) => {
      const dateTime = row.getValue("formattedCreatedAt") as string;
      return (
        <div className="text-sm text-gray-900">
          {dateTime}
        </div>
      );
    },
  },
  {
    accessorKey: "medicineName",
    header: "MEDICINE",
    cell: ({ row }) => {
      const medicine = row.getValue("medicineName") as string;
      return (
        <div className="text-sm font-medium text-gray-900">
          {medicine}
        </div>
      );
    },
  },
  {
    accessorKey: "dosage",
    header: "DOSAGE",
    cell: ({ row }) => {
      const dosage = row.getValue("dosage") as string;
      return (
        <div className="text-sm text-gray-900">
          {dosage}
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "NO OF DAYS",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number;
      return (
        <div className="text-sm text-gray-900">
          {duration} {duration === 1 ? 'day' : 'days'}
        </div>
      );
    },
  },
  {
    accessorKey: "frequency",
    header: "FREQUENCY",
    cell: ({ row }) => {
      const frequency = row.getValue("frequency") as string;
      return (
        <div className="text-sm text-gray-900">
          {frequency}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => {
      const prescription = row.original;

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
                // TODO: Implement edit functionality
                console.log('Edit prescription:', prescription.id);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // TODO: Implement delete functionality
                console.log('Delete prescription:', prescription.id);
              }}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];