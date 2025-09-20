"use client";

import React from "react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

/**
 * Possible order statuses for the pickup table
 */
export type PickupStatus = "picked" | "pending" | "cancelled";

/**
 * Row model for the Pickup Orders table.
 */
export type OrderRow = {
  id: string;
  orderId: string;
  patientId: string;
  gender: "male" | "female" | "other";
  pickupDateTime: string; // pre-formatted date time for display
  status: PickupStatus;
};

/**
 * Props for OrdersTable component
 */
interface OrdersTableProps {
  data: OrderRow[];
  /** Loading state for DataTable skeletons */
  isLoading?: boolean;
}

/**
 * OrdersTable renders a list of pickup orders using the shared DataTable component.
 * It displays columns consistent with the provided UI design (Order ID, Patient ID, Gender, Pickup Date & Time, Status).
 *
 * @param {OrdersTableProps} props - Component props including table data and optional loading flag
 * @returns {JSX.Element} DataTable configured for pickup orders
 * @example
 * const rows: OrderRow[] = [
 *   { id: "1", orderId: "Order-1234", patientId: "Patient-2234", gender: "female", pickupDateTime: "22-May-24 11:24AM", status: "picked" },
 * ];
 * return <OrdersTable data={rows} isLoading={false} />
 */
export default function OrdersTable({ data, isLoading = false }: OrdersTableProps) {
  const columns: ColumnDef<OrderRow>[] = [
    { accessorKey: "orderId", header: "ORDER ID" },
    { accessorKey: "patientId", header: "PATIENT ID" },
    {
      accessorKey: "gender",
      header: "GENDER",
      cell: ({ row }) => <div className="capitalize text-gray-700">{row.getValue("gender") as string}</div>,
    },
    { accessorKey: "pickupDateTime", header: "PICKUP DATE & TIME" },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => {
        const s = row.getValue("status") as PickupStatus;
        const classMap: Record<PickupStatus, string> = {
          picked: "bg-green-100 text-green-700 border-green-300",
          pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
          cancelled: "bg-red-100 text-red-700 border-red-300",
        };
        return (
          <span className={`px-3 py-1 text-xs rounded border ${classMap[s]}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </span>
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
        isLoading,
      }}
    />
  );
}