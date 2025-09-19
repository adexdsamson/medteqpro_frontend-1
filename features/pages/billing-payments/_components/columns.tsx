"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeClasses, formatStatusText } from "@/lib/statusColors";
import { getFormatCurrency } from "@/lib/utils";
import Link from "next/link";

/**
 * Defines the table row shape for the Billing & Payments table.
 */
export type BillRow = {
  transactionId: string;
  patientId: string;
  patientName: string;
  purpose: string;
  minDeposit: number;
  totalPayable: number;
  amountPaid: number;
  remainingBal: number;
  createdAt: string;
  modeOfPayment: string;
  status: "full_payment" | "part_payment" | "not_paid";
};

/**
 * Column definitions for the Billing & Payments table.
 * Mirrors the original implementation under app/(Root)/admin/billing-payments/_components/columns.tsx
 * to ensure identical behavior and rendering.
 *
 * @example
 * <DataTable columns={billColumns} data={rows} />
 */
export const billColumns: ColumnDef<BillRow>[] = [
  { accessorKey: "transactionId", header: "TRANSACTION ID" },
  { accessorKey: "patientId", header: "PATIENT ID" },
  { accessorKey: "patientName", header: "PATIENT NAME" },
  { accessorKey: "purpose", header: "PURPOSE" },
  {
    accessorKey: "minDeposit",
    header: "MIN DEPOSIT",
    cell: ({ getValue }) => getFormatCurrency(getValue<number>()),
  },
  {
    accessorKey: "totalPayable",
    header: "TOTAL PAYABLE",
    cell: ({ getValue }) => getFormatCurrency(getValue<number>()),
  },
  {
    accessorKey: "amountPaid",
    header: "AMOUNT PAID",
    cell: ({ getValue }) => getFormatCurrency(getValue<number>()),
  },
  {
    accessorKey: "remainingBal",
    header: "REMAINING BAL",
    cell: ({ getValue }) => getFormatCurrency(getValue<number>()),
  },
  { accessorKey: "createdAt", header: "DATE CREATED" },
  { accessorKey: "modeOfPayment", header: "MODE OF PAYMENT" },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={`${getStatusBadgeClasses(status)} px-3 py-2 text-xs font-medium rounded-md`}>
          {formatStatusText(status)}
        </Badge>
      );
    },
  },
  {
    id: "action",
    header: "ACTION",
    cell: ({ row }) => (
      <Link
        href={`/admin/billing-payments/${row.original.transactionId}`}
        className="text-blue-600 hover:underline"
      >
        View Detail
      </Link>
    ),
  },
];