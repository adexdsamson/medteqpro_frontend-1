import React from "react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

// Define the type for queue entries
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
type QueueTableProps = {
  data: QueueEntry[];
};

export default function QueueTable({ data }: QueueTableProps) {
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
      header: () => <div className="text-right">ROOM ASSIGNED</div>,
      cell: ({ row }) => {
        return <div className="text-right">{row.getValue("roomAssigned")}</div>;
      },
    },
    {
      accessorKey: "estimatedTime",
      header: () => <div className="text-right">ESTIMATED TIME</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right">{row.getValue("estimatedTime")}</div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      options={{
        disablePagination: true,
        disableSelection: true,
      }}
    />
  );
}
