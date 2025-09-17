/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useMemo, useState } from "react";
import Subheader from "../../_components/Subheader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H3, Large, P, Small } from "@/components/ui/Typography";
import { Search, Filter, Edit } from "lucide-react";
import { faker } from "@faker-js/faker";
import SessionTimer from "../../admin/queuing-system/_components/SessionTimer";
import { DataTable } from "@/components/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
  useGetDrugs,
  Drug,
  useGetDrugAdministrations,
  DrugAdministration,
  useGetDrugRequests,
  DrugRequest,
  useGetDrugOrdersOverview,
  useGetDrugReconciliations,
  DrugReconciliation,
} from "@/features/services/drugManagementService";
import RequestDrugDialog from "./_components/RequestDrugDialog";
import AddSupplyDialog from "./_components/AddSupplyDialog";
import RequestNewDrugDialog from "./_components/RequestNewDrugDialog";
import AdvancedFilters from "./_components/AdvancedFilters";
import { FilterOptions } from "@/features/services/drugManagementService";

const InternalPharmacyPage = () => {
  const [activeTab, setActiveTab] = useState("drug-overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleClearFilters = () => {
    setFilters({
      search: "",
      dateFrom: "",
      dateTo: "",
      status: "",
      drugType: "",
      drugCategory: "",
    });
  };

  // Pagination state for Drug Overview
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const page = useMemo(() => pagination.pageIndex + 1, [pagination.pageIndex]);

  // Combine search term with filters
  const getQueryParams = () => ({
    search: searchTerm || filters.search,
    date_from: filters.dateFrom,
    date_to: filters.dateTo,
    status: filters.status,
    drugType: filters.drugType,
    drugCategory: filters.drugCategory,
  });

  // Fetch drugs list
  const { data: drugsResp, isLoading: isLoadingDrugs } = useGetDrugs({
    page,
    page_size: pagination.pageSize,
    search: searchTerm || filters.search,
    drugType: filters.drugType,
    drugCategory: filters.drugCategory,
  });

  const drugs: Drug[] = useMemo(
    () => (drugsResp?.data?.results as Drug[]) ?? [],
    [drugsResp]
  );
  const totalCounts = useMemo(() => drugsResp?.data?.count ?? 0, [drugsResp]);

  // Fetch daily drug administrations (server search only)
  const { data: adminResp, isLoading: isLoadingAdmin } =
    useGetDrugAdministrations({
      search: searchTerm || filters.search,
      date_from: filters.dateFrom,
      date_to: filters.dateTo,
      status: filters.status,
    });
  const administrations: DrugAdministration[] = useMemo(
    () => (adminResp?.data?.results as DrugAdministration[]) ?? [],
    [adminResp]
  );

  // Fetch drug requests
  const { data: requestsResp, isLoading: isLoadingRequests } =
    useGetDrugRequests({
      search: searchTerm || filters.search,
      date_from: filters.dateFrom,
      date_to: filters.dateTo,
      status: filters.status,
      drugType: filters.drugType,
      drugCategory: filters.drugCategory,
    });
  const drugRequests: DrugRequest[] = useMemo(
    () => (requestsResp?.data?.results as DrugRequest[]) ?? [],
    [requestsResp]
  );

  // Fetch drug reconciliations
  const { data: reconciliationsResp, isLoading: isLoadingReconciliations } =
    useGetDrugReconciliations({
      search: searchTerm || filters.search,
      date_from: filters.dateFrom,
      date_to: filters.dateTo,
      status: filters.status,
    });
  const drugReconciliations: DrugReconciliation[] = useMemo(
    () => (reconciliationsResp?.data?.results as DrugReconciliation[]) ?? [],
    [reconciliationsResp]
  );

  // Fetch overview statistics
  const { data: overviewResp, isLoading: isLoadingOverview } =
    useGetDrugOrdersOverview();
  const overviewStats = useMemo(() => {
    const overview = overviewResp?.data?.data;
    if (overview) {
      return {
        totalCurrentStock: 22300, // Keep static for now as no API endpoint for this
        totalAdministered: 1345, // Keep static for now as no API endpoint for this
        totalCompletedOrders: overview.total_completed_orders,
        totalPendingPickups: overview.total_pending_pickups,
        totalCancelledPickups: overview.total_cancelled_pickups,
      };
    }
    return {
      totalCurrentStock: 22300,
      totalAdministered: 1345,
      totalCompletedOrders: 0,
      totalPendingPickups: 0,
      totalCancelledPickups: 0,
    };
  }, [overviewResp]);

  // Columns for Drug Overview mapping to API fields
  const drugOverviewColumns: ColumnDef<Drug>[] = [
    // {
    //   accessorKey: "id",
    //   cell: ({ row }) => (
    //     <span className="font-medium">{row.getValue("id") as string}</span>
    //   ),
    //   header: "DRUG ID",
    // },
    {
      accessorKey: "drug_name",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.getValue("drug_name") as string}
        </span>
      ),
      header: "DRUG/EQUIPMENT NAME",
    },
    {
      accessorKey: "drug_expiry_date",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.getValue("drug_expiry_date") as string}
        </span>
      ),
      header: "EXPIRY DATE",
    },
    {
      accessorKey: "countdown_to_expiration",
      cell: ({ row }) => (
        <span className="font-medium text-orange-600">
          {row.getValue("countdown_to_expiration") as number}
        </span>
      ),
      header: "COUNT DOWN TO EXPIRATION",
    },
    {
      accessorKey: "quantity_in_stock",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.getValue("quantity_in_stock") as number}
        </span>
      ),
      header: "QUANTITY PREVIOUSLY IN STOCK",
    },
  ];

  const dailyAdministrationColumns: ColumnDef<DrugAdministration>[] = [
    {
      accessorKey: "date_administered",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.getValue("date_administered") as string}
        </span>
      ),
      header: "DATE & TIME",
    },
    {
      accessorKey: "patient_id",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.getValue("patient_id") as string}
        </span>
      ),
      header: "PATIENT ID",
    },
    {
      accessorKey: "patient_name",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.getValue("patient_name") as string}
        </span>
      ),
      header: "PATIENT NAME",
    },
    {
      accessorKey: "drug",
      cell: ({ row }) => {
        const drug = row.getValue("drug") as DrugAdministration["drug"];
        return <span className="font-medium">{drug?.drug_name}</span>;
      },
      header: "DRUGS DISPENSED",
    },
    {
      accessorKey: "quantity_administered",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.getValue("quantity_administered") as number}
        </span>
      ),
      header: "QUANTITY GIVEN",
    },
  ];

  const reconciliationColumns: ColumnDef<DrugReconciliation>[] = [
    {
      accessorKey: "drug_name",
      header: "DRUG/EQUIPMENT NAME",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.getValue("drug_name") as string}
        </span>
      ),
    },
    {
      accessorKey: "expiry_date",
      header: "EXPIRY DATE",
      cell: ({ row }) => {
        const date = row.getValue("expiry_date") as string;
        return (
          <span>
            {new Date(date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            })}
          </span>
        );
      },
    },
    {
      accessorKey: "delivery_date",
      header: "DELIVERY DATE",
      cell: ({ row }) => {
        const date = row.getValue("delivery_date") as string;
        return (
          <span>
            {new Date(date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            })}
          </span>
        );
      },
    },
    {
      accessorKey: "quantity_invoiced",
      header: "QUANTITY INVOICED",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.getValue("quantity_invoiced") as number}
        </span>
      ),
    },
    {
      accessorKey: "quantity_delivered",
      header: "QUANTITY DELIVERED",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.getValue("quantity_delivered") as number}
        </span>
      ),
    },
    {
      accessorKey: "discrepancy",
      header: "DISCREPANCY",
      cell: ({ row }) => {
        const invoiced = row.original.quantity_invoiced;
        const delivered = row.original.quantity_delivered;
        const discrepancy = invoiced - delivered;
        const discrepancyColor =
          discrepancy > 0
            ? "text-red-600"
            : discrepancy < 0
            ? "text-green-600"
            : "text-gray-600";
        return (
          <span className={`font-medium ${discrepancyColor}`}>
            {discrepancy}
          </span>
        );
      },
    },
  ];

  const drugRequestColumns: ColumnDef<DrugRequest>[] = [
    {
      accessorKey: "drug_name_requested",
      header: "DRUGS",
      cell: ({ row }) => (
        <span>{row.getValue("drug_name_requested") as string}</span>
      ),
    },
    {
      accessorKey: "quantity_requested",
      header: "REQUESTED QUANTITY",
      cell: ({ row }) => (
        <span>{row.getValue("quantity_requested") as number}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusColor =
          status === "approved"
            ? "text-green-600"
            : status === "rejected"
            ? "text-red-600"
            : "text-yellow-600";
        return (
          <span className={`font-medium capitalize ${statusColor}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "quantity_in_stock_of_requested_drug",
      header: "IN STOCK",
      cell: ({ row }) => (
        <span className="font-medium">
          {(row.getValue("quantity_in_stock_of_requested_drug") as number) || 0}
        </span>
      ),
    },
    {
      accessorKey: "requested_by",
      header: "REQUESTED BY",
      cell: ({ row }) => <span>{row.getValue("requested_by") as string}</span>,
    },
    {
      id: "action",
      header: "ACTION",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Request</DropdownMenuItem>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const getTabButton = (tabKey: string) => {
    const buttons = {
      "drug-overview": (
        <div className="flex gap-2">
          <AddSupplyDialog>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Add Supply
            </Button>
          </AddSupplyDialog>
          <RequestNewDrugDialog>
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Request New Drug
            </Button>
          </RequestNewDrugDialog>
        </div>
      ),
      "daily-administration": (
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Dispense Drug
        </Button>
      ),
      "drug-reconciliation": (
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Stock Drug
        </Button>
      ),
      "drug-request": (
        <RequestDrugDialog>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Request Drug
          </Button>
        </RequestDrugDialog>
      ),
    };
    return buttons[tabKey as keyof typeof buttons] || null;
  };

  return (
    <>
      <Subheader title="Pharmacy"  />

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen w-full">
        <div className="flex items-center justify-end">
          {getTabButton(activeTab)}
        </div>
        {/* Overview Stats */}
        <div className="space-y-4">
          <Large className="text-lg font-semibold">Overview</Large>

          <div className="grid grid-cols-4 gap-4 ">
            <Card className="bg-white p-6">
              <div className="text-center">
                <H3 className="text-2xl font-bold text-gray-900">
                  {overviewStats.totalCurrentStock.toLocaleString()}
                </H3>
                <P className="text-sm text-gray-600 mt-1">
                  Total Current Stock
                </P>
              </div>
            </Card>

            <Card className="bg-white p-6">
              <div className="text-center">
                <H3 className="text-2xl font-bold text-gray-900">
                  {overviewStats.totalAdministered.toLocaleString()}
                </H3>
                <P className="text-sm text-gray-600 mt-1">Total Administered</P>
              </div>
            </Card>

            <Card className="bg-white p-6">
              <div className="text-center">
                <H3 className="text-2xl font-bold text-gray-900">
                  {overviewStats.totalCompletedOrders.toLocaleString()}
                </H3>
                <P className="text-sm text-gray-600 mt-1">
                  Total Completed Orders
                </P>
              </div>
            </Card>

            <Card className="bg-white p-6">
              <div className="text-center">
                <H3 className="text-2xl font-bold text-gray-900">
                  {overviewStats.totalPendingPickups.toLocaleString()}
                </H3>
                <P className="text-sm text-gray-600 mt-1">
                  Total Pending Pickups
                </P>
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-3"
        >
          <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="drug-overview"
              className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Drug Overview
            </TabsTrigger>
            <TabsTrigger
              value="daily-administration"
              className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Daily Drug Administration
            </TabsTrigger>
            <TabsTrigger
              value="drug-reconciliation"
              className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Drug Reconciliation
            </TabsTrigger>
            <TabsTrigger
              value="drug-request"
              className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Drug Request
            </TabsTrigger>
          </TabsList>

          <div className="">
            {/* Search and Filter */}
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <Small className="text-gray-600">Search Keyword</Small>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Drug Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              <AdvancedFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
                activeTab={activeTab}
              />
            </div>

            {/* Tab Content */}
            <TabsContent value="drug-overview" className="mt-0 overflow-auto max-w-[76vw]">
              <DataTable<Drug>
                columns={drugOverviewColumns}
                data={drugs}
                options={{
                  isLoading: isLoadingDrugs,
                  totalCounts,
                  manualPagination: true,
                  pagination,
                  setPagination,
                  disableSelection: true,
                }}
              />
            </TabsContent>

            <TabsContent value="daily-administration" className="mt-0">
              <DataTable<DrugAdministration>
                columns={dailyAdministrationColumns}
                data={administrations}
                options={{
                  isLoading: isLoadingAdmin,
                  disableSelection: true,
                  disablePagination: true,
                }}
              />
            </TabsContent>

            <TabsContent value="drug-reconciliation" className="mt-0">
              <DataTable<DrugReconciliation>
                columns={reconciliationColumns}
                data={drugReconciliations}
                options={{
                  isLoading: isLoadingReconciliations,
                  disableSelection: true,
                  disablePagination: true,
                }}
              />
            </TabsContent>

            <TabsContent value="drug-request" className="mt-0">
              <DataTable<DrugRequest>
                columns={drugRequestColumns}
                data={drugRequests}
                options={{
                  isLoading: isLoadingRequests,
                  disableSelection: true,
                  disablePagination: true,
                }}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default InternalPharmacyPage;
