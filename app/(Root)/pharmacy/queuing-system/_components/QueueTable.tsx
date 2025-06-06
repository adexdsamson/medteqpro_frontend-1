"use client";

import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

// Define the type for queue entries
export type QueueEntry = {
  counter: number;
  serialNumber: string;
  gender: string;
  estimatedTime: string;
};

type QueueTableProps = {
  data: QueueEntry[];
  onStartPatient: (entry: QueueEntry) => void;
};

export default function QueueTable({ data, onStartPatient }: QueueTableProps) {
  // Define columns for the queue table
  const columns: ColumnDef<QueueEntry>[] = [
    {
      accessorKey: "counter",
      header: "COUNTER",
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("counter")}</div>;
      },
    },
    {
      accessorKey: "serialNumber",
      header: "SERIAL NO",
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("serialNumber")}</div>;
      },
    },
    {
      accessorKey: "gender",
      header: "GENDER",
      cell: ({ row }) => {
        return <div className="text-gray-600">{row.getValue("gender")}</div>;
      },
    },
    {
      accessorKey: "estimatedTime",
      header: "ESTIMATED TIME",
      cell: ({ row }) => {
        return <div className="text-gray-600">{row.getValue("estimatedTime")}</div>;
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const entry = row.original;
        return (
          <Button
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 text-sm"
            onClick={() => onStartPatient(entry)}
          >
            Start
          </Button>
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