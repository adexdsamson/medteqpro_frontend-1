"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { getFormatCurrency } from "@/lib/utils";

/**
 * Subscription history item type definition
 */
export interface SubscriptionHistoryItem {
  subscription_plan: string;
  amount: number;
  start_date: string;
  end_date: string;
  status: string;
}

/**
 * Column definitions for the subscription history DataTable
 * @returns Array of column definitions for subscription history data
 */
export const subscriptionColumns: ColumnDef<SubscriptionHistoryItem>[] = [
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("plan")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return <div>{getFormatCurrency(amount || 0)}</div>;
    },
  },
  {
    accessorKey: "timestamp",
    header: "Date",
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp") as string;
      return <div>{new Date(timestamp).toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "interval",
    header: "Interval",
    cell: ({ row }) => {
      const interval = row.getValue("interval") as string;
      return <div>{interval}</div>;
    },
  },
  {
    accessorKey: "is_paid",
    header: "Paid",
    cell: ({ row }) => {
      const isPaid = row.getValue("is_paid") as boolean;
      return (
        <Badge
          variant={isPaid ? "default" : "secondary"}
        >
          {isPaid ? "Paid" : "Not Paid"}
        </Badge>
      );
    },
  },
];