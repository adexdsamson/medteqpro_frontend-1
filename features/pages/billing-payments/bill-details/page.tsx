"use client";

import React from "react";
import Subheader from "@/layouts/Subheader";
import { SEOWrapper } from "@/components/SEO";
import { useParams } from "next/navigation";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  useBillDetails,
  type BillResponse,
  type TransactionResponse,
  useUpdateBillStatus,
} from "@/features/services/billingService";
import type { ApiResponseError } from "@/types";
import { getFormatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToastHandler } from "@/hooks/useToaster";

/**
 * Centralized Bill Detail feature page.
 * Uses useParams to read transactionId from the URL at the route wrapper level.
 * Integrates with billingService.useBillDetails to fetch bill and transactions.
 *
 * @returns {JSX.Element} Bill detail feature page
 * @example
 * // Used within admin wrapper route
 * // app/(Root)/admin/billing-payments/[transactionId]/page.tsx
 * // return <BillDetailFeaturePage />
 */
export default function BillDetailFeaturePage() {
  const params = useParams();
  const transactionId = (params?.transactionId || "") as string;

  // Fetch bill details
  const { data, isLoading, isError, error } = useBillDetails(transactionId);
  const apiError = error as ApiResponseError | undefined;

  // Extract payload based on ApiResponse<T> being AxiosResponse<T>
  const details = data?.data?.data as
    | { bill: BillResponse; transactions: TransactionResponse[] }
    | undefined;

  const bill: BillResponse | undefined = details?.bill;
  const transactions: TransactionResponse[] = details?.transactions ?? [];

  // Toast & status update mutation
  const toast = useToastHandler();
  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateBillStatus();

  // Local state for selected next status
  const [nextStatus, setNextStatus] = React.useState<string>("");
  React.useEffect(() => {
    if (bill?.status) setNextStatus(bill.status);
  }, [bill?.status]);

  const formatStatusLabel = (s: string) => {
    const map: Record<string, string> = {
      paid: "Paid",
      pending: "Pending",
      cancelled: "Cancelled",
      partially_paid: "Partially Paid",
    };
    return map[s] ?? s;
  };

  const handleUpdateStatus = async () => {
    if (!bill?.id) {
      toast.error("Error", "Bill ID not found");
      return;
    }
    try {
      await updateStatus({ billId: bill.id, status: nextStatus });
      toast.success(
        "Status Updated",
        `Status changed to ${formatStatusLabel(nextStatus)}`
      );
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error("Error", err?.message ?? "Failed to update status");
    }
  };

  // Transactions table columns
  const txnColumns: ColumnDef<TransactionResponse>[] = [
    { accessorKey: "transaction_date", header: "Date" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ getValue }) => getFormatCurrency(Number(getValue() ?? 0)),
    },
    { accessorKey: "payment_method", header: "Method" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "reference_number", header: "Reference" },
  ];

  return (
    <>
      <SEOWrapper
        title={`Bill Detail - SwiftPro eProcurement Portal`}
        description="View transaction details, payment history, and outstanding balances for the selected bill."
        keywords="bill detail, payments, invoice, hospital billing"
        canonical={`/admin/billing-payments/${transactionId}`}
        robots="noindex, nofollow"
        ogImage="/assets/medteq-og-image.jpg"
        ogImageAlt="Medteq Healthcare System - Bill Detail"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Medteq Healthcare System",
        }}
      />

      <Subheader title="Bill Detail" />

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Transaction ID</p>
          <p className="text-lg font-semibold">{transactionId}</p>
        </div>

        {isLoading && (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">Loading bill details...</p>
          </div>
        )}

        {isError && (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-red-600 font-medium">
              Failed to load bill details
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {apiError?.message ?? "Unexpected error"}
            </p>
          </div>
        )}

        {!isLoading && !isError && bill && (
          <>
            <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Patient</p>
                <p className="text-base font-medium">{bill.patient_fullname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Purpose</p>
                <p className="text-base font-medium capitalize">
                  {bill.purpose}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-base font-medium">
                  {getFormatCurrency(Number(bill.total_amount ?? 0))}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="text-base font-medium">
                  {getFormatCurrency(Number(bill.amount_paid ?? 0))}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining Balance</p>
                <p className="text-base font-medium">
                  {getFormatCurrency(Number(bill.remaining_amount ?? 0))}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-base font-medium capitalize">
                  {bill.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="text-base font-medium">
                  {bill.created_at
                    ? format(new Date(bill.created_at), "MMM d, yyyy h:mm a")
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="text-base font-medium capitalize">
                  {bill.payment_method}
                </p>
              </div>
              {bill.comments && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Comments</p>
                  <p className="text-base text-gray-700">{bill.comments}</p>
                </div>
              )}
            </div>

            {/* Status Update Controls */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-wrap items-end gap-4">
                <div className="min-w-[240px]">
                  <p className="text-sm text-gray-600">Update Payment Status</p>
                  <div className="mt-2 w-64">
                    <Select value={nextStatus} onValueChange={setNextStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partially_paid">
                          Partially Paid
                        </SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={
                      isUpdating || !nextStatus || bill?.status === "paid"
                    }
                    className="min-w-[140px]"
                  >
                    {isUpdating ? "Updating..." : "Update Status"}
                  </Button>
                </div>
              </div>
            </div>

            {Array.isArray(bill.drugs) && bill.drugs.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm font-semibold text-gray-700 mb-4">
                  Drugs
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Qty</th>
                        <th className="py-2 pr-4">Unit Price</th>
                        <th className="py-2 pr-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bill.drugs.map((d, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="py-2 pr-4">{d.drug_name}</td>
                          <td className="py-2 pr-4">{d.quantity}</td>
                          <td className="py-2 pr-4">
                            {getFormatCurrency(Number(d.unit_price ?? 0))}
                          </td>
                          <td className="py-2 pr-4">
                            {getFormatCurrency(Number(d.total_price ?? 0))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">
                Transactions
              </p>
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <DataTable
                    columns={txnColumns}
                    data={transactions}
                    options={{ disableSelection: true }}
                  />
                </div>
              ) : (
                <p className="text-gray-500">
                  No transactions recorded for this bill yet.
                </p>
              )}
            </div>
          </>
        )}

        {!isLoading && !isError && !bill && (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">No bill details available.</p>
          </div>
        )}
      </div>
    </>
  );
}
