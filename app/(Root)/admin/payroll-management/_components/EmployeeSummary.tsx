"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { faker } from "@faker-js/faker";
import { ColumnDef } from "@tanstack/react-table";

interface Employee {
  id: string;
  name: string;
  hireDate: string;
  salary: string;
}

// Generate fake employee data
const generateEmployees = (count: number): Employee[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    hireDate: "22-May-24", // Using the same date as in the design
    salary: `₦${faker.number.int({ min: 100, max: 500 }).toLocaleString()},000`,
  }));
};

const EmployeeSummary = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const employees = generateEmployees(50); // Generate 50 employees for demo

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "name",
      header: () => <div className="font-semibold text-gray-700">EMPLOYEE</div>,
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "hireDate",
      header: () => <div className="font-semibold text-gray-700">Date of Hire</div>,
      cell: ({ row }) => <div>{row.original.hireDate}</div>,
    },
    {
      accessorKey: "salary",
      header: () => <div className="font-semibold text-gray-700">Salary</div>,
      cell: ({ row }) => <div>{row.original.salary}</div>,
    },
    {
      id: "actions",
      header: () => <div className="font-semibold text-gray-700 text-right">ACTION</div>,
      cell: () => {
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
  const paginatedData = employees.slice(
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
          totalCounts: employees.length,
          isLoading: false,
          disablePagination: false,
          disableSelection: true,
        }}
      />
    </div>
  );
};

export default EmployeeSummary;