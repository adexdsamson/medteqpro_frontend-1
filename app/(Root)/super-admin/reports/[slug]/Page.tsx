import Subheader from "@/app/(Root)/_components/Subheader";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import React from "react";

type Payment = {
  month: string;
  amount: string;
  date: string;
  status: string;
};

export default function ReportDetail() {
  const reportData = {
    hospital: "Greenlife Hospital",
    subscriptionTotal: "₦3,000,000",
    doctors: 14,
    patients: 500,
    reportDate: "22-Mar-2025",
    payments: [
      { month: "Feb", amount: "₦30,000", date: "22-Mar-2025", status: "Paid" },
      { month: "Mar", amount: "₦30,000", date: "22-Mar-2025", status: "Paid" },
      { month: "Apr", amount: "₦30,000", date: "22-Mar-2025", status: "Paid" },
      { month: "May", amount: "₦30,000", date: "22-Mar-2025", status: "Paid" },
    ],
  };

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell({ row: { index } }) {
        return index + 1;
      },
    },
    {
      accessorKey: "month",
      header: "Hospital Name",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ];

  return (
    <>
      <Subheader title="Reports" />

      <div className="px-6 mt-6 space-y-5">
        <div className="border-b border-gray-200">
          <p className="text-sm font-bold">Greenlife Hospital</p>
        </div>

        <div className="flex justify-end">
          <Button variant="default" className="bg-gray-900 text-white">
            Download
          </Button>
        </div>

        <div className="border rounded-md p-6 bg-white">
          {/* Header section with stats */}
          <div className="grid grid-cols-3 mb-8">
            <div className="col-span-1">
              <div className="flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="MedteqPro Logo"
                  width={150}
                  height={40}
                />
              </div>
            </div>

            <div className="col-span-2 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm font-medium mb-1">Subscription Total</p>
                <p className="text-lg font-bold">
                  {reportData.subscriptionTotal}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Doctors</p>
                <p className="text-lg font-bold">{reportData.doctors}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Patients</p>
                <p className="text-lg font-bold">{reportData.patients}</p>
              </div>
            </div>
          </div>

          {/* Date of report */}
          <div className="flex justify-end mb-6">
            <div className="text-right">
              <p className="text-sm font-medium">Date of Report</p>
              <p className="text-sm">{reportData.reportDate}</p>
            </div>
          </div>

          {/* Hospital name */}
          <div className="bg-gray-50 p-3 border-t border-b">
            <p className="text-center font-medium">{reportData.hospital}</p>
          </div>

          {/* Report title */}
          <div className="p-3 border-b">
            <p className="text-center font-medium">Report</p>
          </div>

          {/* Payment table */}
          <DataTable
            {...{
              columns,
              data: reportData.payments,
              options: { disableSelection: true },
            }}
          />
        </div>
      </div>
    </>
  );
}
