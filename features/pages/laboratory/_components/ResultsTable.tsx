"use client";

import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmAlert } from "@/components/ConfirmAlert";
import { MoreHorizontal } from "lucide-react";
import { useToastHandler } from "@/hooks/useToaster";
import { useDeleteLabManagementTest } from "@/features/services/labScientistService";

/**
 * Row model for the Results table
 */
export type ResultRow = {
  id: string;
  labNo: string;
  patientName: string;
  testType: string;
  status: string;
  testDate: string; // formatted date for display
};

interface ResultsTableProps {
  data: ResultRow[];
  isLoading?: boolean;
}

/**
 * ResultsTable lists completed lab results using shared DataTable.
 * Keeps structure consistent with other lab tables.
 * @param props - data and loading flag
 */
export default function ResultsTable({ data, isLoading = false }: ResultsTableProps) {
  const columns: ColumnDef<ResultRow>[] = [
    { accessorKey: "labNo", header: "LAB NO" },
    { accessorKey: "patientName", header: "PATIENT NAME" },
    { accessorKey: "testType", header: "TEST TYPE" },
    { accessorKey: "status", header: "STATUS" },
    { accessorKey: "testDate", header: "TEST DATE" },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => <RowActions row={row.original} />,
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      options={{
        disablePagination: true,
        disableSelection: true,
        isLoading,
      }}
    />
  );
}

/**
 * RowActions for Results table.
 * Provides Delete action for a completed test with confirmation.
 * @param {{ row: ResultRow }} props - Row data
 * @returns {JSX.Element}
 */
const RowActions = ({ row }: { row: ResultRow }) => {
  const toast = useToastHandler();
  const { mutateAsync: deleteTest, isPending: isDeleting } =
    useDeleteLabManagementTest(row.id);

  const handleDelete = async () => {
    try {
      await deleteTest();
      toast.success("Deleted", "Lab result deleted successfully");
    } catch (error: unknown) {
      const message =
        (error as { message?: string })?.message ||
        "Failed to delete lab result";
      toast.error("Error", message);
    }
  };

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
        {/* Reserved for future: View details */}
        <DropdownMenuSeparator />
        <ConfirmAlert
          title="Delete lab result"
          text="This action cannot be undone. Do you want to delete this result?"
          trigger={
            <Button
              variant={"ghost"}
              disabled={isDeleting}
              className="text-red-600"
            >
              Delete
            </Button>
          }
          onConfirm={handleDelete}
          confirmText="Yes, delete"
          cancelText="Cancel"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};