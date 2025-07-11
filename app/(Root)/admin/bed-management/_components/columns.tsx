"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export interface BedData {
  bedId: string;
  roomNo: string;
  patientId: string | null;
  allocationDateTime: string | null;
  duration: number | null;
}

export const bedColumns = (onAssignBed?: (bedId: string) => void): ColumnDef<BedData>[] => [
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
      const bedId = row.getValue("bedId") as string;
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
        </div>
      );
    },
  },
];