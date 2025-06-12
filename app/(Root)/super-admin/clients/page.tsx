"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { makeArrayDataWithLength } from "@/demo";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { format } from "date-fns";
import Subheader from "../../_components/Subheader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterHospitalDialog from "./_components/RegisterHospitalDialog";

enum Status {
  Active = "Active",
  Suspended = "Suspended",
}

export type SubscriptionType = {
  id: string;
  hospitalName: string;
  amount: string;
  subscriptionDate: string;
  expiryDate: string;
  status: Status;
  numberOfMonths: number;
};

export type ClientType = {
  id: string;
  name: string;
  email: string;
  hospitalName: string;
  numberOfDoctor: number;
  registeredDate: string;
  location: string;
  status: Status;
};

const getSampleData = makeArrayDataWithLength<ClientType>(
  (faker) => ({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    hospitalName: faker.company.name(),
    location: faker.location.state(),
    numberOfDoctor: faker.number.int({ min: 0, max: 10 }),
    registeredDate: faker.date.future().toString(),
    status: faker.helpers.enumValue(Status),
  }),
  5
);

const getSampleSubData = makeArrayDataWithLength<SubscriptionType>(
  (faker) => ({
    id: faker.string.uuid(),
    amount: faker.finance.amount({ symbol: "₦" }),
    expiryDate: faker.date.future().toString(),
    hospitalName: faker.company.name(),
    numberOfMonths: faker.number.int({ min: 0, max: 10 }),
    subscriptionDate: faker.date.future().toString(),
    status: faker.helpers.enumValue(Status),
  }),
  5
);

export default function ClientManagement() {
  const columns: ColumnDef<ClientType>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell({ row: { index } }) {
        return index + 1;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
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
      accessorKey: "registeredDate",
      header: "Date Registered",
      cell({ getValue }) {
        return format(getValue<string>(), "dd-MMM-yyyy");
      },
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell({ getValue }) {
        return <span>{getValue<string>()}</span>;
      },
    },
  ];

  const columns2: ColumnDef<SubscriptionType>[] = [
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
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "numberOfMonths",
      header: "Number of Months",
    },
    {
      accessorKey: "subscriptionDate",
      header: "Subscription Date",
      cell({ getValue }) {
        return format(getValue<string>(), "dd-MMM-yyyy");
      },
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell({ getValue }) {
        return format(getValue<string>(), "dd-MMM-yyyy");
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell({ getValue }) {
        return <span>{getValue<string>()}</span>;
      },
    },
  ];

  return (
    <>
      <Subheader title="Client Management" />

      <div className="px-6 mt-6 space-y-5">
        <div className="flex items-center justify-between border-b py-2">
          <p>Client List</p>
          <RegisterHospitalDialog>
            <Button>Register Hospital</Button>
          </RegisterHospitalDialog>
        </div>

        <Tabs defaultValue="tab-1">
          <ScrollArea>
            <TabsList className="mb-3 gap-1 bg-transparent">
              <TabsTrigger
                value="tab-1"
                className="data-[state=active]:bg-primary/30 data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-accent-foreground rounded-lg data-[state=active]:shadow-none"
              >
                Registered Client
              </TabsTrigger>
              <TabsTrigger
                value="tab-2"
                className="data-[state=active]:bg-primary/30 data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-accent-foreground rounded-lg data-[state=active]:shadow-none"
              >
                Subscription
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="tab-1">
            <div className="bg-white p-1.5 rounded-lg">
              <DataTable
                {...{
                  columns,
                  data: getSampleData,
                  options: { disableSelection: true },
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="tab-2">
            <div className="bg-white p-1.5 rounded-lg">
              <DataTable
                {...{
                  columns: columns2,
                  data: getSampleSubData,
                  options: { disableSelection: true },
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
