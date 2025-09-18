"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

export interface BedData {
  bedId: string;
  roomNo: string;
  patientId: string | null;
  allocationDateTime: string | null;
  duration: number | null;
  id: string;
  status: "occupied" | "available";
  patientName: string | null;
}

export const bedColumns = (
  onAssignBed?: (bedId: string) => void,
  onEditBed?: (bedId: string) => void,
  onDeleteBed?: (bedId: string) => void
): ColumnDef<BedData>[] => [
  {
    accessorKey: "bedId",
    header: "BED ID",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">{row.getValue("bedId")}</div>
    ),
  },
  {
    accessorKey: "roomNo",
    header: "ROOM NO",
    cell: ({ row }) => (
      <div className="text-gray-700">{row.getValue("roomNo")}</div>
    ),
  },
  {
    accessorKey: "patientId",
    header: "PATIENT ID",
    cell: ({ row }) => {
      const patientId = row.getValue("patientId") as string | null;
      return (
        <div className="text-gray-700">
          {patientId || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.getValue("status") as "occupied" | "available";
      const displayStatus = status === "available" ? "Available" : "Occupied";
      return (
        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
          status === "available" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {displayStatus}
        </div>
      );
    },
  },
  {
    accessorKey: "allocationDateTime",
    header: "ALLOCATION DATE & TIME",
    cell: ({ row }) => {
      const allocationDateTime = row.getValue("allocationDateTime") as string | null;
      return (
        <div className="text-gray-700">
          {allocationDateTime || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "DURATION (DAYS)",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number | null;
      return (
        <div className="text-gray-700">
          {duration !== null ? duration : "N/A"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => {
      const bedId = row.original?.id as string;
      const patientId = row.getValue("patientId") as string | null;
      const isAvailable = !patientId;
      
      return (
        <div className="flex items-center gap-2">
          {isAvailable && onAssignBed && (
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onAssignBed(bedId)}
            >
              Assign
            </Button>
          )}
          {!isAvailable && (
            <span className="text-sm text-gray-500">Occupied</span>
          )}
          
          {/* Dropdown menu for Edit and Delete actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onEditBed?.(bedId)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteBed?.(bedId)}
                className="cursor-pointer text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];