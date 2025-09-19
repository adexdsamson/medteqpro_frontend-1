"use client";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import React from "react";
import { useParams } from "next/navigation";
import { useGetHospitalDetailedReport } from "@/features/services/reportsService";
import { format } from "date-fns";
import { getFormatCurrency } from "@/lib/utils";
import Subheader from "../../../../../layouts/Subheader";

// Import the SubscriptionHistory type from reportsService
import { SubscriptionHistory } from "@/features/services/reportsService";


export default function ReportDetail() {
  const params = useParams();
  const hospitalId = params.slug as string;
  
  const { data: reportData, isLoading } = useGetHospitalDetailedReport(hospitalId);
  const report = reportData?.data?.data;
  
  if (isLoading) {
    return (
      <>
        <Subheader title="Reports" />
        <div className="px-6 mt-6">
          <div className="text-center py-8">Loading...</div>
        </div>
      </>
    );
  }
  
  if (!report) {
    return (
      <>
        <Subheader title="Reports" />
        <div className="px-6 mt-6">
          <div className="text-center py-8">Report not found</div>
        </div>
      </>
    );
  }

  const columns: ColumnDef<SubscriptionHistory>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell({ row: { index } }) {
        return index + 1;
      },
    },
    {
      accessorKey: "subscription_plan",
      header: "Subscription Plan",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell({ getValue }) {
        return getFormatCurrency(getValue<number>());
      },
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell({ getValue }) {
        return format(new Date(getValue<string>()), "dd-MMM-yyyy");
      },
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell({ getValue }) {
        return format(new Date(getValue<string>()), "dd-MMM-yyyy");
      },
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
          <p className="text-sm font-bold">{report.hospital_name}</p>
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
                  {getFormatCurrency(report.total_amount_paid || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Doctors</p>
                <p className="text-lg font-bold">{report.no_of_doctors || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Patients</p>
                <p className="text-lg font-bold">{report.no_of_patients || 0}</p>
              </div>
            </div>
          </div>

          {/* Date of report */}
          <div className="flex justify-end mb-6">
            <div className="text-right">
              <p className="text-sm font-medium">Date of Report</p>
              <p className="text-sm">{format(new Date(report.date_of_report), "dd-MMM-yyyy")}</p>
            </div>
          </div>

          {/* Hospital name */}
          <div className="bg-gray-50 p-3 border-t border-b">
            <p className="text-center font-medium">{report.hospital_name}</p>
          </div>

          {/* Report title */}
          <div className="p-3 border-b">
            <p className="text-center font-medium">Report</p>
          </div>

          {/* Payment table */}
          <DataTable
            {...{
              columns,
              data: report.subscription_history || [],
              options: { disableSelection: true },
            }}
          />
        </div>
      </div>
    </>
  );
}
