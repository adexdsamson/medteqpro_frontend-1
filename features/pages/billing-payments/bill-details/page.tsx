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
} from "@/features/services/billingService";
import type { ApiResponseError } from "@/types";

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
  const details = data?.data as
    | { bill: BillResponse; transactions: TransactionResponse[] }
    | undefined;

  const bill: BillResponse | undefined = details?.bill;
  const transactions: TransactionResponse[] = details?.transactions ?? [];

  // Transactions table columns
  const txnColumns: ColumnDef<TransactionResponse>[] = [
    { accessorKey: "transaction_date", header: "Date" },
    { accessorKey: "amount", header: "Amount" },
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
            <p className="text-red-600 font-medium">Failed to load bill details</p>
            <p className="text-sm text-gray-500 mt-1">{apiError?.message ?? "Unexpected error"}</p>
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
                <p className="text-base font-medium capitalize">{bill.purpose}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-base font-medium">{bill.total_amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="text-base font-medium">{bill.amount_paid}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining Balance</p>
                <p className="text-base font-medium">{bill.remaining_amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-base font-medium capitalize">{bill.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="text-base font-medium">{bill.created_at}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="text-base font-medium capitalize">{bill.payment_method}</p>
              </div>
              {bill.comments && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Comments</p>
                  <p className="text-base text-gray-700">{bill.comments}</p>
                </div>
              )}
            </div>

            {Array.isArray(bill.drugs) && bill.drugs.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm font-semibold text-gray-700 mb-4">Drugs</p>
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
                          <td className="py-2 pr-4">{d.unit_price}</td>
                          <td className="py-2 pr-4">{d.total_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">Transactions</p>
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <DataTable columns={txnColumns} data={transactions} options={{ disableSelection: true }} />
                </div>
              ) : (
                <p className="text-gray-500">No transactions recorded for this bill yet.</p>
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