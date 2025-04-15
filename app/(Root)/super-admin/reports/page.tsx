"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import React from "react";
import Subheader from "../../_components/Subheader";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { makeArrayDataWithLength } from "@/demo";
import { StatCard } from "../dashboard/_components";
import { Building, Building2, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export type ReportType = {
  id: string;
  numberOfPatient: string;
  monthSubscribed: string;
  hospitalName: string;
  numberOfDoctor: number;
  registeredDate: string;
  amount: string;
};

const getSampleReportData = makeArrayDataWithLength<ReportType>(
  (faker) => ({
    id: faker.string.uuid(),
    numberOfPatient: faker.number.int({ min: 1, max: 100 }).toString(),
    monthSubscribed: faker.number.int({ min: 1, max: 12 }).toString(),
    hospitalName: faker.company.name(),
    numberOfDoctor: faker.number.int({ min: 1, max: 10 }),
    registeredDate: faker.date.anytime().toString(),
    amount: faker.finance.amount(),
  }),
  5
);

export default function Reports() {
  const router = useRouter();

  const columns: ColumnDef<ReportType>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell({ row: { index } }) {
        return index + 1;
      },
    },
    {
      accessorKey: "hospitalName",
      header: "Hospital Name",
    },
    {
      accessorKey: "numberOfDoctor",
      header: "Number of Doctors",
    },
    {
      accessorKey: "numberOfPatient",
      header: "Number of Patients",
    },
    {
      accessorKey: "monthSubscribed",
      header: "Number of Months Subscribed",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "registeredDate",
      header: "Date Registered",
      cell({ getValue }) {
        return format(getValue<string>(), "dd-MMM-yyyy");
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
            value={52}
            icon={<Building className="h-5 w-5 text-blue-500" />}
          />
          <StatCard
            title="Revenue in Subscription"
            value={`N35+m`}
            icon={<Building2 className="h-5 w-5 text-green-500" />}
          />
          <StatCard
            title="No of Doctors"
            value={501}
            icon={<Building className="h-5 w-5 text-red-500" />}
          />
          <StatCard
            title="Patients"
            value={10000}
            icon={<Users className="h-5 w-5 text-purple-500" />}
          />
        </div>

        <div className="flex justify-end w-full py-2">
          <Button>Download</Button>
        </div>

        <div className="bg-white p-1.5 rounded-lg">
          <DataTable
            {...{
              columns,
              data: getSampleReportData,
              options: { disableSelection: true },
            }}
          />
        </div>
      </div>
    </>
  );
}
