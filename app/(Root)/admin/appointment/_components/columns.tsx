'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { getStatusBadgeClasses, formatStatusText } from '@/lib/statusColors';

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  gender: string;
  appointmentDateTime: string;
  status: string;
};

export const appointmentColumns: ColumnDef<Appointment>[] = [
  {
    accessorKey: 'patientId',
    header: 'PATIENT ID',
  },
  {
    accessorKey: 'patientName',
    header: 'PATIENT NAME',
  },
  {
    accessorKey: 'gender',
    header: 'GENDER',
  },
  {
    accessorKey: 'appointmentDateTime',
    header: 'APPOINTMENT DATE & TIME',
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge className={`${getStatusBadgeClasses(status)} px-3 py-2 text-xs font-medium rounded-md`}>
          {formatStatusText(status)}
        </Badge>
      );
    },
  },
];

export type AppointmentFamily = {
  familyId: string;
  familyName: string;
  numberOfMembers: number;
  appointmentDateTime: string;
  status: string;
};

export const appointmentFamilyColumns: ColumnDef<AppointmentFamily>[] = [
  {
    accessorKey: 'familyId',
    header: 'FAMILY ID',
  },
  {
    accessorKey: 'familyName',
    header: 'FAMILY NAME',
  },
  {
    accessorKey: 'numberOfMembers',
    header: 'NUMBER OF MEMBERS',
  },
  {
    accessorKey: 'appointmentDateTime',
    header: 'APPOINTMENT DATE & TIME',
  },
  {
    accessorKey:'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge className={`${getStatusBadgeClasses(status)} px-3 py-2 text-xs font-medium rounded-md`}>
          {formatStatusText(status)}
        </Badge>
      );
    }
  }
]