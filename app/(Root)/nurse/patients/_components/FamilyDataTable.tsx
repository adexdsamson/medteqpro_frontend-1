'use client';

import React from 'react';
import { DataTable } from '@/components/DataTable';
import { FamilyType } from '@/features/services/patientService';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface FamilyDataTableProps {
  families: FamilyType[];
  isLoading?: boolean;
}

const familyColumns: ColumnDef<FamilyType>[] = [
  {
    accessorKey: 'familyName',
    header: 'Family Name',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('familyName')}</div>
    ),
  },
  {
    accessorKey: 'members',
    header: 'Members',
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('members')}</div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created Date',
    cell: ({ row }) => (
      <div>{row.getValue('createdAt')}</div>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // TODO: Navigate to family details
            console.log('View family:', row.original.id);
          }}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </div>
    ),
  },
];

export const FamilyDataTable: React.FC<FamilyDataTableProps> = ({
  families,
  isLoading = false,
}) => {
  return (
    <DataTable
      columns={familyColumns}
      data={families}
      options={{
        isLoading,
        disablePagination: false,
        disableSelection: true,
      }}
    />
  );
};

export default FamilyDataTable;