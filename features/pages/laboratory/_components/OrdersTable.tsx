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
import { useDeleteLabManagementTest } from "@/features/services/labScientistService";

/**
 * Row model for the Orders table (scheduled/pending tests)
 */
export type OrderRow = {
  id: string;
  labNo: string;
  patientName: string;
  entryCategory: string;
  testType: string;
  scheduledDate: string; // formatted date
  status: string;
};

interface OrdersTableProps {
  data: OrderRow[];
  isLoading?: boolean;
}

/**
 * OrdersTable displays scheduled lab tests (orders) with essential info.
 */
export default function OrdersTable({ data, isLoading = false }: OrdersTableProps) {
  const columns: ColumnDef<OrderRow>[] = [
    { accessorKey: "labNo", header: "LAB NO" },
    { accessorKey: "patientName", header: "PATIENT NAME" },
    { accessorKey: "entryCategory", header: "CATEGORY" },
    { accessorKey: "testType", header: "TEST TYPE" },
    { accessorKey: "scheduledDate", header: "SCHEDULED DATE" },
    { accessorKey: "status", header: "STATUS" },
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
 * RowActions component for Orders table rows.
 * Provides destructive action to delete a lab test order with confirmation.
 * Hooks are used within this component to comply with React rules.
 * @param {{ row: OrderRow }} props - The row data of the test order
 * @returns {JSX.Element}
 * @example
 * <RowActions row={row.original} />
 */
const RowActions = ({ row }: { row: OrderRow }) => {
  const toast = useToastHandler();
  const { mutateAsync: deleteTest, isPending: isDeleting } =
    useDeleteLabManagementTest(row.id);

  const handleDelete = async () => {
    try {
      await deleteTest();
      toast.success("Deleted", "Lab test order deleted successfully");
    } catch (error: unknown) {
      const message =
        (error as { message?: string })?.message ||
        "Failed to delete lab test order";
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
        {/* Placeholder for future actions like Update/Edit */}
        {/* <DropdownMenuItem disabled>Update (coming soon)</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <ConfirmAlert
          title="Delete lab test"
          text="This action cannot be undone. Do you want to delete this lab test order?"
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