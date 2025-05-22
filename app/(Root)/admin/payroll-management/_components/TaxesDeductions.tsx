"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { faker } from "@faker-js/faker";
import { ColumnDef } from "@tanstack/react-table";

interface TaxDeduction {
  id: string;
  name: string;
  type: string;
  amount: string;
  status: string;
}

// Generate fake tax and deduction data
const generateTaxesDeductions = (count: number): TaxDeduction[] => {
  const types = ["Tax", "Pre-Tax Deduction", "Post-Tax Deduction"];
  const statuses = ["Active", "Pending", "Completed"];
  
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.finance.accountName(),
    type: faker.helpers.arrayElement(types),
    amount: `₦${faker.number.int({ min: 10, max: 100 }).toLocaleString()},000`,
    status: faker.helpers.arrayElement(statuses),
  }));
};

const TaxesDeductions = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const taxesDeductions = generateTaxesDeductions(50); // Generate 50 items for demo

  const columns: ColumnDef<TaxDeduction>[] = [
    {
      accessorKey: "name",
      header: () => <div className="font-semibold text-gray-700">NAME</div>,
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "type",
      header: () => <div className="font-semibold text-gray-700">TYPE</div>,
      cell: ({ row }) => <div>{row.original.type}</div>,
    },
    {
      accessorKey: "amount",
      header: () => <div className="font-semibold text-gray-700">AMOUNT</div>,
      cell: ({ row }) => <div>{row.original.amount}</div>,
    },
    {
      accessorKey: "status",
      header: () => <div className="font-semibold text-gray-700">STATUS</div>,
      cell: ({ row }) => {
        const status = row.original.status;
        let statusClass = "";
        
        switch(status) {
          case "Active":
            statusClass = "bg-green-100 text-green-800";
            break;
          case "Pending":
            statusClass = "bg-yellow-100 text-yellow-800";
            break;
          case "Completed":
            statusClass = "bg-blue-100 text-blue-800";
            break;
          default:
            statusClass = "bg-gray-100 text-gray-800";
        }
        
        return (
          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {status}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="font-semibold text-gray-700 text-right">ACTION</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <Button 
              variant="ghost" 
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-0 h-auto font-medium"
            >
              View Detail
            </Button>
          </div>
        );
      },
    },
  ];

  // Get current page data
  const paginatedData = taxesDeductions.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

  return (
    <div className="w-full">
      <DataTable
        data={paginatedData}
        columns={columns}
        options={{
          manualPagination: true,
          pagination: pagination,
          setPagination: setPagination,
          totalCounts: taxesDeductions.length,
          isLoading: false,
          disablePagination: false,
          disableSelection: true,
        }}
      />
    </div>
  );
};

export default TaxesDeductions;