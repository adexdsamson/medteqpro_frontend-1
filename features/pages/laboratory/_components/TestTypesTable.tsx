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
import { MoreHorizontal } from "lucide-react";
import { ConfirmAlert } from "@/components/ConfirmAlert";
import { useToastHandler } from "@/hooks/useToaster";
import { useDeleteLabTestType } from "@/features/services/labScientistService";

/**
 * Row model for the Test Types table
 */
export type TestTypeRow = {
  id: string;
  name: string;
  category: string;
  isActive: boolean;
};

/**
 * Props for TestTypesTable component
 */
interface TestTypesTableProps {
  data: TestTypeRow[];
  /** Loading state for DataTable skeletons */
  isLoading?: boolean;
}

/**
 * TestTypesTable renders a list of laboratory test types using the shared DataTable component.
 * It displays test name, category, and active status.
 *
 * @param props - Component props including data and loading flag
 * @returns DataTable with configured columns for test types
 * @example
 * <TestTypesTable data={rows} isLoading={query.isLoading} />
 */
export default function TestTypesTable({ data, isLoading = false }: TestTypesTableProps) {
  const columns: ColumnDef<TestTypeRow>[] = [
    {
      accessorKey: "name",
      header: "TEST NAME",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "category",
      header: "CATEGORY",
      cell: ({ row }) => (
        <div className="capitalize text-gray-600">{row.original.category}</div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "STATUS",
      cell: ({ row }) => (
        <span className={
          row.original.isActive
            ? "text-green-600 font-medium"
            : "text-gray-500"
        }>
          {row.original.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
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
 * RowActions component for Test Types table.
 * Provides a delete action with confirmation.
 * @param {{ row: TestTypeRow }} props - Row data
 * @returns {JSX.Element}
 */
const RowActions = ({ row }: { row: TestTypeRow }) => {
  const toast = useToastHandler();
  const { mutateAsync: deleteType, isPending: isDeleting } = useDeleteLabTestType(row.id);

  const handleDelete = async () => {
    try {
      await deleteType();
      toast.success("Deleted", "Test type deleted successfully");
    } catch (error: unknown) {
      const message =
        (error as { message?: string })?.message || "Failed to delete test type";
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
        {/* Placeholder for toggle active or edit when available */}
        <DropdownMenuSeparator />
        <ConfirmAlert
          title="Delete test type"
          text="This action cannot be undone. Do you want to delete this test type?"
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