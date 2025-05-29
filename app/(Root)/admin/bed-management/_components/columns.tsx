"use client";

import { ColumnDef } from "@tanstack/react-table";

export interface BedData {
  bedId: string;
  roomNo: string;
  patientId: string | null;
  allocationDateTime: string | null;
  duration: number | null;
}

export const bedColumns: ColumnDef<BedData>[] = [
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
];