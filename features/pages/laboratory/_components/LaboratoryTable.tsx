"use client";

import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

/**
 * Type definition for laboratory entries
 */
export type LaboratoryEntry = {
  id: string;
  patientId: string;
  patientName: string;
  gender: string;
  testDateTime: string;
  status?: string;
  testType?: string;
};

/**
 * Props for the LaboratoryTable component
 */
type LaboratoryTableProps = {
  data: LaboratoryEntry[];
};

/**
 * Laboratory table component for displaying lab test entries
 * @param data - Array of laboratory entries to display
 * @returns JSX element containing the data table
 */
export default function LaboratoryTable({ data }: LaboratoryTableProps) {
  // Define columns for the laboratory table matching the image design
  const columns: ColumnDef<LaboratoryEntry>[] = [
    {
      accessorKey: "patientId",
      header: "PATIENT ID",
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("patientId")}</div>;
      },
    },
    {
      accessorKey: "patientName",
      header: "PATIENT NAME",
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("patientName")}</div>;
      },
    },
    {
      accessorKey: "gender",
      header: "GENDER",
      cell: ({ row }) => {
        const gender = row.getValue("gender") as string;
        return (
          <div className="text-gray-600 capitalize">
            {gender}
          </div>
        );
      },
    },
    {
      accessorKey: "testDateTime",
      header: "TEST DATE & TIME",
      cell: ({ row }) => {
        return <div className="text-gray-600">{row.getValue("testDateTime")}</div>;
      },
    },
    {
      id: "actions",
      header: "ACTION",
      cell: ({ row }) => {
        const entry = row.original;
        
        return (
          <Button
            size="sm"
            variant="outline"
            className="text-blue-600 border-blue-200 hover:bg-blue-50 px-4 py-1 text-sm rounded flex items-center gap-1"
            onClick={() => {
              // Handle view/edit action
              console.log('View entry:', entry.id);
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
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
        isLoading: false,
      }}
    />
  );
}