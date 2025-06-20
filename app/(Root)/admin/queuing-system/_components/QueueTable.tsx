import React from 'react';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';

// Define the type for queue entries
export type QueueEntry = {
  id?: string;
  counter: number;
  serialNumber: string;
  patientId: string;
  patientName?: string;
  roomAssigned: string;
  estimatedTime: string;
  status?: string;
  priority?: string;
  purpose?: string;
  createdAt?: string;
};

type QueueTableProps = {
  data: QueueEntry[];
};

export default function QueueTable({ data }: QueueTableProps) {
  // Define columns for the queue table
  const columns: ColumnDef<QueueEntry>[] = [
    {
      accessorKey: "counter",
      header: "COUNTER",
    },
    {
      accessorKey: "serialNumber",
      header: "SERIAL NUMBER",
    },
    {
      accessorKey: "patientId",
      header: "PATIENT ID",
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
        return <div className="text-right">{row.getValue("estimatedTime")}</div>;
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