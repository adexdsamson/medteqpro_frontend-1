'use client';

import React from 'react';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';

export type Subscription = {
  id: string;
  hospitalName: string;
  subscriptionDate: string;
  expiryDate: string;
  status: string;
};

interface SubscriptionTableProps {
  subscriptions?: Subscription[];
  isLoading?: boolean;
}

export function SubscriptionTable({ 
  subscriptions = [],
  isLoading = false 
}: SubscriptionTableProps) {
  const columns: ColumnDef<Subscription>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'hospitalName',
      header: 'Hospital Name',
    },
    {
      accessorKey: 'subscriptionDate',
      header: 'Subscription Date',
    },
    {
      accessorKey: 'expiryDate',
      header: 'Expiry Date',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="rounded-md border bg-white">
      <DataTable
        data={subscriptions}
        columns={columns}
        options={{
          isLoading,
          disablePagination: true,
          disableSelection: true,
        }}
      />
    </div>
  );
}