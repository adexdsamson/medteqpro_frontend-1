"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useGetHospitalList } from "@/features/services/hospitalService";
import { useGetSubscriptionList } from "@/features/services/subscriptionService";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { format, parseISO } from "date-fns";
import Subheader from "../../_components/Subheader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterHospitalDialog from "./_components/RegisterHospitalDialog";

enum Status {
  Active = "active",
  Inactive = "inactive",
  Suspended = "suspended",
}

import { HospitalListType } from "@/features/services/hospitalService";

export type SubscriptionType = {
  id: number;
  hospitalName: string;
  planName: string;
  amount: string;
  subscriptionDate: string;
  expiryDate: string | null;
  status: Status;
};

export type ClientType = HospitalListType;

export default function ClientManagement() {
  const { data: hospitalList, isLoading: isLoadingHospitals } = useGetHospitalList();
  const { data: subscriptionList, isLoading: isLoadingSubscriptions } = useGetSubscriptionList();

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
        return dateValue ? format(parseISO(dateValue), "dd-MMM-yyyy") : "No date";
      },
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell({ getValue }) {
        const dateValue = getValue<string | null>();
        return dateValue ? format(parseISO(dateValue), "dd-MMM-yyyy") : "No expiry date";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell({ getValue }) {
        const status = getValue<string>();
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "active" ? "bg-green-100 text-green-800" :
            status === "inactive" ? "bg-gray-100 text-gray-800" :
            "bg-red-100 text-red-800"
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
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
                  options: { disableSelection: true, isLoading: isLoadingHospitals },
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="tab-2">
            <div className="bg-white p-1.5 rounded-lg">
              <DataTable
                {...{
                  columns: columns2,
                  data: subscriptionList?.data?.data ? subscriptionList.data.data.map((subscription, index) => ({
                    id: index + 1,
                    hospitalName: subscription.hospital_name,
                    planName: subscription.plan_name,
                    amount: subscription.amount,
                    subscriptionDate: subscription.last_subscription_date,
                    expiryDate: subscription.expiry_date,
                    status: subscription.status as Status,
                  })) : [],
                  options: { disableSelection: true, isLoading: isLoadingSubscriptions },
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
