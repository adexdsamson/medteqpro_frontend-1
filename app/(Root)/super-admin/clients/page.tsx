"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useGetHospitalList } from "@/features/services/hospitalService";
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

import { HospitalListType } from "@/features/services/hospitalService";

export type SubscriptionType = {
  id: string;
  hospitalName: string;
  amount: string;
  subscriptionDate: string;
  expiryDate: string;
  status: Status;
  numberOfMonths: number;
};

export type ClientType = HospitalListType;

export default function ClientManagement() {
  const { data: hospitalList, isLoading } = useGetHospitalList();

  const columns: ColumnDef<ClientType>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell({ row: { index } }) {
        return index + 1;
      },
    },
    {
      accessorKey: "admin_full_name",
      header: "Hospital Name",
    },
    {
      accessorKey: "admin_email",
      header: "Email",
    },
    {
      accessorKey: "no_of_doctors",
      header: "Number of Doctors",
    },
    {
      accessorKey: "created_at",
      header: "Date Registered",
      cell({ getValue }) {
        return getValue<string>() ? format(new Date(getValue<string>() ?? "01/05/1994"), "dd-MMM-yyyy") : "No date";
      },
    },
    {
      accessorKey: "state",
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
        const dateValue = getValue<string>();
        return dateValue ? format(new Date(dateValue ?? "01/05/1994"), "dd-MMM-yyyy") : "No date";
      },
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell({ getValue }) {
        const dateValue = getValue<string>();
        return dateValue ? format(new Date(dateValue ?? "01/05/1994"), "dd-MMM-yyyy") : "No date";
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
                  data: hospitalList?.data?.data || [],
                  options: { disableSelection: true, isLoading },
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="tab-2">
            <div className="bg-white p-1.5 rounded-lg">
              <DataTable
                {...{
                  columns: columns2,
                  data: [], // Subscription data is not available from the API yet
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
