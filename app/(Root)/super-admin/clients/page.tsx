"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useGetHospitalList } from "@/features/services/hospitalService";
import { useGetSubscriptionList } from "@/features/services/subscriptionService";
import { ColumnDef } from "@tanstack/react-table";
import React, { Suspense } from "react";
import { format, parseISO } from "date-fns";
import Subheader from "../../../../layouts/Subheader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterHospitalDialog from "./_components/RegisterHospitalDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";

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

function ClientManagementContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const defaultTab =
    tabParam === "tab-2" || tabParam === "subscriptions" ? "tab-2" : "tab-1";
  const { data: hospitalList, isLoading: isLoadingHospitals } =
    useGetHospitalList();
  const { data: subscriptionList, isLoading: isLoadingSubscriptions } =
    useGetSubscriptionList();

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
        return getValue<string>()
          ? format(new Date(getValue<string>() ?? "01/05/1994"), "dd-MMM-yyyy")
          : "No date";
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const client = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-xs text-center"
                onClick={() => console.log("Activate", client)}
              >
                Activate
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs text-center"
                onClick={() => console.log("Suspend", client)}
              >
                Suspend
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs text-center"
                onClick={() => console.log("View License", client)}
              >
                View License
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
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
      cell({ getValue }) {
        const amount = getValue<string>();
        return amount ? `₦${parseFloat(amount).toLocaleString()}` : "N/A";
      },
    },
    {
      accessorKey: "no_of_doctors",
      header: "Number of Doctors",
    },
    {
      accessorKey: "subscriptionDate",
      header: "Subscription Date",
      cell({ getValue }) {
        const dateValue = getValue<string>();
        return dateValue
          ? format(parseISO(dateValue), "dd-MMM-yyyy")
          : "No date";
      },
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell({ getValue }) {
        const dateValue = getValue<string | null>();
        return dateValue
          ? format(parseISO(dateValue), "dd-MMM-yyyy")
          : "No expiry date";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell({ getValue }) {
        const status = getValue<string>();
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : status === "inactive"
                ? "bg-gray-100 text-gray-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const subscription = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => console.log("Activate", subscription)}
              >
                Activate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Suspend", subscription)}
              >
                Suspend
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("View License", subscription)}
              >
                View License
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

        <Tabs defaultValue={defaultTab}>
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
            <div className="bg-white p-1.5 rounded-lg overflow-auto max-w-[76vw]">
              <DataTable
                {...{
                  columns,
                  data: hospitalList?.data?.data || [],
                  options: {
                    disableSelection: true,
                    isLoading: isLoadingHospitals,
                  },
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="tab-2">
            <div className="bg-white p-1.5 rounded-lg overflow-auto max-w-[76vw]">
              <DataTable
                {...{
                  columns: columns2,
                  data: subscriptionList?.data?.data
                    ? subscriptionList.data.data.map((subscription, index) => ({
                        id: index + 1,
                        hospitalName: subscription.hospital_name,
                        planName: subscription.plan_name,
                        amount: subscription.amount,
                        subscriptionDate: subscription.last_subscription_date,
                        expiryDate: subscription.expiry_date,
                        status: subscription.status as Status,
                      }))
                    : [],
                  options: {
                    disableSelection: true,
                    isLoading: isLoadingSubscriptions,
                  },
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default function ClientManagement() {
  return (
    <Suspense fallback={<div className="px-6 mt-6">Loading clients...</div>}>
      <ClientManagementContent />
    </Suspense>
  );
}
