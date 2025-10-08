"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import React from "react";
import Subheader from "../../../../layouts/Subheader";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { StatCard } from "../dashboard/_components";
import { Building, Building2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetHospitalReportsOverview, useGetHospitalReportsList, HospitalListItem } from "@/features/services/reportsService";
import { getFormatCurrency } from "@/lib/utils";

export default function Reports() {
  const router = useRouter();
  
  // Fetch data from API
  const { data: overviewData } = useGetHospitalReportsOverview();
  const { data: hospitalListData, isLoading: listLoading } = useGetHospitalReportsList();
  
  const overview = overviewData?.data?.data;
  const hospitalList = hospitalListData?.results?.data || [];

  const columns: ColumnDef<HospitalListItem>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell({ row: { index } }) {
        return index + 1;
      },
    },
    {
      accessorKey: "hospital_name",
      header: "Hospital Name",
    },
    {
      accessorKey: "no_of_doctors",
      header: "Number of Doctors",
    },
    {
      accessorKey: "no_of_patients",
      header: "Number of Patients",
    },
    {
      accessorKey: "total_amount_paid",
      header: "Amount",
      cell({ getValue }) {
        return getFormatCurrency(getValue<number>());
      },
    },
    {
      accessorKey: "date_registered",
      header: "Date Registered",
      cell({ getValue }) {
        return format(new Date(getValue<string>()), "dd-MMM-yyyy");
      },
    },
    {
      id: "action",
      header: "Action",
      cell({ row }) {
        return (
          <Button
            onClick={() =>
              router.push(`/super-admin/reports/${row.original.id}`)
            }
            variant={"link"}
          >
            View report
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Subheader title="Reports" />

      <div className="px-6 mt-6 space-y-5">
        <div className="flex items-end border-b py-2">
          <h4 className="text-sm font-bold">All Report</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="No of Hospitals"
            value={overview?.total_no_of_hospitals || 0}
            icon={<Building className="h-5 w-5 text-blue-500" />}
          />
          <StatCard
            title="Revenue in Subscription"
            value={overview?.total_revenue ? getFormatCurrency(overview.total_revenue) : "₦0"}
            icon={<Building2 className="h-5 w-5 text-green-500" />}
          />
          <StatCard
            title="No of Doctors"
            value={overview?.total_no_of_doctors || 0}
            icon={<Building className="h-5 w-5 text-red-500" />}
          />
          <StatCard
            title="Patients"
            value={overview?.total_no_of_patients || 0}
            icon={<Users className="h-5 w-5 text-purple-500" />}
          />
        </div>

        <div className="flex justify-end w-full py-2">
          <Button>Download</Button>
        </div>

        <div className="bg-white p-1.5 rounded-lg overflow-auto max-w-[76vw]">
          <DataTable
            {...{
              columns,
              data: hospitalList,
              options: { disableSelection: true, isLoading: listLoading },
            }}
          />
        </div>
      </div>
    </>
  );
}
