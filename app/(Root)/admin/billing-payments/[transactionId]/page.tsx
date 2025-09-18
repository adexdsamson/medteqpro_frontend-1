import React from "react";
import Subheader from "../../../_components/Subheader";
import { SEOWrapper } from "@/components/SEO";

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const { transactionId } = await params;

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
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">
            Placeholder for bill detail content and payment history.
          </p>
        </div>
      </div>
    </>
  );
}
