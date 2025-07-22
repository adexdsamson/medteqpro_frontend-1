"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VitalSignsResponse } from "@/features/services/vitalSignsService";

export const columns: ColumnDef<VitalSignsResponse>[] = [
  {
    accessorKey: "created_at",
    header: "DATE & TIME",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return <div>{`${formattedDate} ${formattedTime}`}</div>;
    },
  },
  {
    accessorKey: "body_temperature",
    header: "BODY TEMP (C)",
  },
  {
    accessorKey: "pulse_rate",
    header: "PULSE RATE (B/M)",
  },
  {
    accessorKey: "blood_pressure",
    header: "BLOOD PRESSURE (mm/Hg)",
    cell: ({ row }) => {
      const vitalSign = row.original;
      return (
        <div>{`${vitalSign.systolic_blood_pressure}/${vitalSign.diastolic_blood_pressure}`}</div>
      );
    },
  },
  {
    accessorKey: "oxygen_saturation",
    header: "OXYGEN SATURATION (%)",
  },
  {
    id: "actions",
    header: "ACTION",
    cell: ({ row }) => {
      const vitalSign = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(vitalSign.id)}
            >
              Edit Vital Sign
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete Vital Sign</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];