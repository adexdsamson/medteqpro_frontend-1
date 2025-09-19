import React from "react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

/**
 * Queue Entry Interface
 * Defines the structure of a queue entry with patient and staff information
 */
export interface QueueEntry {
  id: string;
  patient_id: string;
  patient_fullname: string;
  patient_gender: string;
  assigned_hospital_staff_fullname: string;
  estimated_waiting_time: number;
  status: string;
  priority: string;
  purpose: string;
  created_at: string;
  estimatedTime: string;
  roomAssigned: string;
  serialNumber: number;
}

/**
 * Queue Table Props Interface
 */
type QueueTableProps = {
  data: QueueEntry[];
  onStartPatient?: (queueEntry: QueueEntry) => void;
};

/**
 * Queue Table Component
 * 
 * Displays the queue entries in a structured table format with columns for
 * serial number, patient ID, priority, room assignment, estimated time, and session status.
 * 
 * @param {QueueTableProps} props - The component props
 * @returns {JSX.Element} The queue table component
 */
export default function QueueTable({ data, onStartPatient }: QueueTableProps) {
  // Define columns for the queue table
  const columns: ColumnDef<QueueEntry>[] = [
    {
      accessorKey: "serialNumber",
      header: "SERIAL NUMBER",
    },
    {
      accessorKey: "patient_id",
      header: "PATIENT ID",
    },
    {
      accessorKey: "priority",
      header: "PRIORITY",
    },
    {
      accessorKey: "roomAssigned",
      header: () => <div className="">ROOM ASSIGNED</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("roomAssigned")}</div>;
      },
    },
    {
      accessorKey: "estimatedTime",
      header: () => <div className="">ESTIMATED TIME</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("estimatedTime")}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "SESSION",
      cell: ({ row }) => {
        return (
          <div className={cn("p-2 border text-center capitalize", {
            "bg-green-100 text-green-800 border-green-600": row.getValue("status") === "in progress",
            "bg-yellow-100 text-yellow-800 border-yellow-600": row.getValue("status") === "waiting",
            "bg-red-100 text-red-800 border-red-600": row.getValue("status") === "cancelled",
          })}>
            {row.getValue("status")}
          </div>
        );
      },
    },
  ];

  // Add action column if onStartPatient is provided
  if (onStartPatient) {
    columns.push({
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => {
        const queueEntry = row.original;
        return (
          <button
            onClick={() => onStartPatient(queueEntry)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Start
          </button>
        );
      },
    });
  }

  return (
    <div className="w-full max-w-[76vw] bg-white p-2">
      <DataTable
        columns={columns}
        data={data}
        options={{
          disablePagination: true,
          disableSelection: true,
        }}
      />
    </div>
  );
}