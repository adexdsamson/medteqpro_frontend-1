/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
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
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

// Generate sample data for different tabs
const generateDrugOverviewData = () => {
  return Array.from({ length: 5 }, (_, index) => ({
    id: `Drug-${index + 1}`,
    drugName: faker.helpers.arrayElement([
      "Paracetamol 100mg",
      "Normal Saline",
      "Syringe",
      "Amitriptyline",
      "Ibuprofen 200mg",
      "Aspirin 75mg",
      "Metformin 500mg",
      "Lisinopril 10mg",
    ]),
    expiryDate: faker.date.future().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    }),
    countDownToExpiration: faker.number.int({ min: 1, max: 365 }),
    quantityInStock: faker.number.int({ min: 0, max: 1200 }),
  }));
};

const generateDailyAdministrationData = () => {
  return Array.from({ length: 20 }, (_, index) => ({
    id: `Patient-${faker.number.int({ min: 1000, max: 9999 })}`,
    dateTime:
      faker.date.recent().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      }) +
      " " +
      faker.date.recent().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) +
      "AM",
    patientId: `Patient-${faker.number.int({ min: 1000, max: 9999 })}`,
    patientName: faker.person.fullName(),
    drugsDispensed: "Paracetamol tab",
    quantityGiven: faker.number.int({ min: 1, max: 20 }),
  }));
};

const generateReconciliationData = () => {
  return Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    drugName: faker.helpers.arrayElement([
      "Paracetamol tab",
      "Syringe",
      "Cotton Wool",
      "Amitriptyline",
    ]),
    expiryDate: faker.date.future().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    }),
    deliveryDate: faker.date.recent().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    }),
    quantityInvoiced: faker.number.int({ min: 50, max: 150 }),
    quantityDelivered: faker.number.int({ min: 50, max: 150 }),
  }));
};

const generateDrugRequestData = () => {
  return Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    drugs: faker.helpers.arrayElement([
      "Paracetamol tab",
      "Amitriptyline",
      "Gascol",
      "Danacid tab",
    ]),
    proposedQuantity: `${faker.number.int({
      min: 10,
      max: 100,
    })} ${faker.helpers.arrayElement(["cups", "packs"])}`,
    approvedQuantity: `${faker.number.int({
      min: 10,
      max: 100,
    })} ${faker.helpers.arrayElement(["cups", "packs"])}`,
    inStock: faker.number.int({ min: 0, max: 10 }),
    action: "edit",
  }));
};

const drugOverviewData = generateDrugOverviewData();
const dailyAdministrationData = generateDailyAdministrationData();
const reconciliationData = generateReconciliationData();
const drugRequestData = generateDrugRequestData();

type DrugOverviewProps = typeof drugOverviewData[0];
type DailyAdministrationProps = typeof dailyAdministrationData[0];
type ReconciliationProps = typeof reconciliationData[0];
type DrugRequestProps = typeof drugRequestData[0];

const InternalPharmacyPage = () => {
  const [activeTab, setActiveTab] = useState("drug-overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Overview stats
  const overviewStats = {
    totalCurrentStock: 22300,
    totalAdministered: 1345,
    previouslyStocked: 21300,
    additionalSupplied: 1000,
  };

  const drugOverviewColumns: ColumnDef<DrugOverviewProps>[] = [
    {
      accessorKey: "id",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("id")}</span>
      ),
      header: "DRUG ID"
    },
    {
      accessorKey: "drugName",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("drugName")}</span>
      ),
      header: "DRUG/EQUIPMENT NAME"
    },
    {
      accessorKey: "expiryDate",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("expiryDate")}</span>
      ),
      header: "EXPIRY DATE"
    },
    {
      accessorKey: "countDownToExpiration",
      cell: ({ row }) => (
        <span className="font-medium text-orange-600">
          {row.getValue("countDownToExpiration")}
        </span>
      ),
      header: "COUNT DOWN TO EXPIRATION"
    },
    {
      accessorKey: "quantityInStock",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("quantityInStock")}</span>
      ),
      header: "QUANTITY PREVIOUSLY IN STOCK"
    },
  ];

  const dailyAdministrationColumns: ColumnDef<DailyAdministrationProps>[] = [
    {
      accessorKey: 'dateTime',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("dateTime")}</span>
      ),
      header: "DATE & TIME"
    },
    {
      accessorKey: 'patientId',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("patientId")}</span>
      ),
      header: "PATIENT ID"
    },
    {
      accessorKey: 'patientName',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("patientName")}</span>
      ),
      header: "PATIENT NAME"
    },
    {
      accessorKey: 'drugsDispensed',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("drugsDispensed")}</span>
      ),
      header: "DRUGS DISPENSED"
    },
    {
      accessorKey: 'quantityGiven',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("quantityGiven")}</span>
      ),
      header: "QUANTITY GIVEN"
    }
  ];

  const reconciliationColumns: ColumnDef<ReconciliationProps>[] = [
    {
      accessorKey: "drugName",
      header: "DRUG/EQUIPMENT NAME",
      cell: ({ row }) => <span>{row.getValue("drugName")}</span>,
    },
    {
      accessorKey: "expiryDate",
      header: "EXPIRY DATE",
      cell: ({ row }) => <span>{row.getValue("expiryDate")}</span>,
    },
    {
      accessorKey: "deliveryDate",
      header: "DELIVERY DATE",
      cell: ({ row }) => <span>{row.getValue("deliveryDate")}</span>,
    },
    {
      accessorKey: "quantityInvoiced",
      header: "QUANTITY INVOICED",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("quantityInvoiced")}</span>
      ),
    },
    {
      accessorKey: "quantityDelivered",
      header: "QUANTITY DELIVERED",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("quantityDelivered")}</span>
      ),
    },
  ];

  const drugRequestColumns: ColumnDef<DrugRequestProps>[] = [
    {
      accessorKey: "drugs",
      header: "DRUGS",
      cell: ({ row }) => <span>{row.getValue("drugs")}</span>,
    },
    {
      accessorKey: "proposedQuantity",
      header: "PROPOSED QUANTITY",
      cell: ({ row }) => <span>{row.getValue("proposedQuantity")}</span>,
    },
    {
      accessorKey: "approvedQuantity",
      header: "APPROVED QUANTITY",
      cell: ({ row }) => <span>{row.getValue("approvedQuantity")}</span>,
    },
    {
      accessorKey: "inStock",
      header: "IN STOCK",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("inStock")}</span>
      ),
    },
    {
      accessorKey: "action",
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
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Add Supply
          </Button>
          <Button
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Request New Drug
          </Button>
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Request Drug
        </Button>
      ),
    };
    return buttons[tabKey as keyof typeof buttons] || null;
  };

  return (
    <>
      <Subheader title="Pharmacy" middle={<SessionTimer />} />

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen w-full">
        <div className="flex items-center justify-end">
          {getTabButton(activeTab)}
        </div>
        {/* Overview Stats */}
        <div className="space-y-4">
          <Large className="text-lg font-semibold">Overview</Large>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  {overviewStats.previouslyStocked.toLocaleString()}
                </H3>
                <P className="text-sm text-gray-600 mt-1">Previously Stocked</P>
              </div>
            </Card>

            <Card className="bg-white p-6">
              <div className="text-center">
                <H3 className="text-2xl font-bold text-gray-900">
                  {overviewStats.additionalSupplied.toLocaleString()}
                </H3>
                <P className="text-sm text-gray-600 mt-1">
                  Additional Supplied
                </P>
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-3">
          <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
            <TabsTrigger value="drug-overview" className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Drug Overview
            </TabsTrigger>
            <TabsTrigger value="daily-administration" className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Daily Drug Administration
            </TabsTrigger>
            <TabsTrigger value="drug-reconciliation" className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Drug Reconciliation
            </TabsTrigger>
            <TabsTrigger value="drug-request" className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
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
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Tab Content */}
            <TabsContent value="drug-overview" className="mt-0">
              <DataTable
                columns={drugOverviewColumns}
                data={drugOverviewData.filter(
                  (item) =>
                    item.drugName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    item.id.toLowerCase().includes(searchTerm.toLowerCase())
                )}
                // showPagination={true}
                // pageSize={10}
              />
            </TabsContent>

            <TabsContent value="daily-administration" className="mt-0">
              <DataTable
                columns={dailyAdministrationColumns}
                data={dailyAdministrationData.filter(
                  (item) =>
                    item.patientName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    item.patientId
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )}
              />
            </TabsContent>

            <TabsContent value="drug-reconciliation" className="mt-0">
              <DataTable
                columns={reconciliationColumns}
                data={reconciliationData.filter((item) =>
                  item.drugName.toLowerCase().includes(searchTerm.toLowerCase())
                )}
              />
            </TabsContent>

            <TabsContent value="drug-request" className="mt-0">
              <DataTable
                columns={drugRequestColumns}
                data={drugRequestData.filter((item) =>
                  item.drugs.toLowerCase().includes(searchTerm.toLowerCase())
                )}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default InternalPharmacyPage;
