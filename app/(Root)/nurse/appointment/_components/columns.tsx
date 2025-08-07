'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

export type Appointment = {
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
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
      if (status === 'Completed') variant = 'secondary'; // Greenish, using secondary for now
      if (status === 'Cancelled') variant = 'destructive'; // Reddish
      if (status === 'Rescheduled') variant = 'outline'; // Bluish/Yellowish, using outline for now
      // 'Upcoming' will use 'default'

      return <Badge variant={variant} className={`capitalize px-3 py-2 text-xs font-medium rounded-md
        ${status === 'Completed' ? 'bg-green-100 text-green-700' : ''}
        ${status === 'Rescheduled' ? 'bg-yellow-100 text-yellow-700' : ''}
        ${status === 'Cancelled' ? 'bg-red-100 text-red-700' : ''}
        ${status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : ''}
      `}>{status}</Badge>;
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
      let variant: 'default' |'secondary' | 'destructive' | 'outline' = 'default';
      if (status === 'Completed') variant ='secondary'; // Greenish, using secondary for now
      if (status === 'Cancelled') variant = 'destructive'; // Reddish
      if (status === 'Rescheduled') variant = 'outline'; // Bluish/Yellowish, using outline for now
      // 'Upcoming' will use 'default'
      return <Badge variant={variant} className={`capitalize px-3 py-2 text-xs font-medium rounded-md
        ${status === 'Completed'? 'bg-green-100 text-green-700' : ''}
        ${status === 'Rescheduled'? 'bg-yellow-100 text-yellow-700' : ''}
        ${status === 'Cancelled'? 'bg-red-100 text-red-700' : ''}
        ${status === 'Upcoming'? 'bg-blue-100 text-blue-700' : ''}
      `}>{status}</Badge>;
    }
  }
]