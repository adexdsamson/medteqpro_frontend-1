"use client";

import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

// Define the type for queue entries specific to lab scientist
export type QueueEntry = {
  id: string;
  counter: number;
  serialNumber: string;
  gender: string;
  estimatedTime: string;
  status?: string;
  priority?: string;
  patientName?: string;
  purpose?: string;
};

type QueueTableProps = {
  data: QueueEntry[];
  onStartPatient: (id: string, status: string) => void;
};

export default function QueueTable({ data, onStartPatient }: QueueTableProps) {
  // Define columns for the queue table matching the image design
  const columns: ColumnDef<QueueEntry>[] = [
    {
      accessorKey: "counter",
      header: "COUNTER",
      cell: ({ row }) => {
        return <div className="font-medium text-center">{row.getValue("counter")}</div>;
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
        const gender = row.getValue("gender") as string;
        return (
          <div className="text-gray-600 capitalize">
            {gender === "male" ? "Male" : "Female"}
          </div>
        );
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
        const status = entry.status?.toLowerCase() || "waiting";
        
        if (!entry.id) return null;
        
        if (status === "waiting") {
          return (
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 text-sm rounded"
              onClick={() => onStartPatient(entry.id, "in_progress")}
            >
              Start
            </Button>
          );
        } else if (status === "in_progress") {
          return (
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-sm rounded"
              onClick={() => onStartPatient(entry.id, "completed")}
            >
              Complete
            </Button>
          );
        } else {
          return (
            <div className="text-gray-400 text-sm">
              {status === "completed" ? "Completed" : "N/A"}
            </div>
          );
        }
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