"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Subheader from "@/layouts/Subheader";
import { Button } from "@/components/ui/button";
import { StatCard } from "../../dashboard/_components";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/DataTable";
import { getFormatCurrency } from "@/lib/utils";
import { useGetHospitalDetailedReport } from "@/features/services/reportsService";
import { subscriptionColumns } from "./_components/subscriptionColumns";

interface PageProps {
  params: { id: string };
}

export default function HospitalReportDetail({ params }: PageProps) {
  const router = useRouter();
  const { data, isLoading, isError } = useGetHospitalDetailedReport(params.id);

  const details = data?.data?.data;

  return (
    <>
      <Subheader title="Hospital Report Detail" />

      <div className="px-6 mt-6 space-y-6">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
          <div>
            <h2 className="text-base font-semibold">
              {details?.hospital_name || "Loading..."}
            </h2>
            <p className="text-xs text-muted-foreground">
              {details?.date_of_report ? (
                <>
                  Report generated on{" "}
                  {new Date(details.date_of_report).toLocaleDateString()}
                </>
              ) : (
                <>Fetching latest report data</>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/super-admin/reports")}
            >
              Back to Reports
            </Button>
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        )}

        {isError && (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-destructive">
                Failed to load report details. Please try again.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats overview */}
        {!isLoading && !isError && details && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Hospital" value={details.hospital_name} />
            <StatCard
              title="No of Doctors"
              value={details.no_of_doctors || 0}
            />
            <StatCard
              title="No of Patients"
              value={details.no_of_patients || 0}
            />
            <StatCard
              title="Total Amount Paid"
              value={getFormatCurrency(details.total_amount_paid || 0)}
            />
          </div>
        )}

        {/* Detailed sections */}
        {!isLoading && !isError && details && (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <h3 className="text-base font-semibold">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hospital Name</span>
                    <span className="font-medium">{details.hospital_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Report Date</span>
                    <span className="font-medium">
                      {new Date(details.date_of_report).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Doctors</span>
                    <span className="font-medium">{details.no_of_doctors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Patients</span>
                    <span className="font-medium">
                      {details.no_of_patients}
                    </span>
                  </div>
                  <div className="flex justify-between md:col-span-2">
                    <span className="text-muted-foreground">
                      Total Amount Paid
                    </span>
                    <span className="font-medium">
                      {getFormatCurrency(details.total_amount_paid || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription History */}
            <div className="space-y-2">
              <h3 className="text-base font-semibold">Subscription History</h3>
              <div className="bg-white p-1.5 rounded-lg">
                <DataTable
                  data={details.subscription_history || []}
                  columns={subscriptionColumns}
                  options={{
                    disablePagination: true,
                    disableSelection: true,
                    isLoading: false,
                    totalCounts: details.subscription_history?.length || 0,
                    manualPagination: false,
                    setPagination: () => {},
                    pagination: { pageIndex: 0, pageSize: 10 },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
