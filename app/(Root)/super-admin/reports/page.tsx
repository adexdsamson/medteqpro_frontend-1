'use client'

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import React from "react";
import Subheader from "../../_components/Subheader";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { makeArrayDataWithLength } from "@/demo";

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
      cell() {
        return <Button variant={"link"}>View report</Button>;
      },
    },
  ];

  return (
    <>
      <Subheader title="Reports" />

      <div className="px-6 mt-6 space-y-5">
        <div className="flex items-end border-b py-2"></div>

        <div className="flex items-end py-2">
          <Button>Register Hospital</Button>
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
