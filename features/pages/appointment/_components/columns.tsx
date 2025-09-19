'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { getStatusBadgeClasses, formatStatusText } from '@/lib/statusColors';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RescheduleAppointmentDialog } from "@/features/pages/appointment/_components/RescheduleAppointmentDialog";
import { useToastHandler } from "@/hooks/useToaster";
import {
  useCancelAppointment,
  useCompleteAppointment,
} from "@/features/services/appointmentService";
import { storeFunctions } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

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
    accessorKey: "patientId",
    header: "PATIENT ID",
  },
  {
    accessorKey: "patientName",
    header: "PATIENT NAME",
  },
  {
    accessorKey: "gender",
    header: "GENDER",
  },
  {
    accessorKey: "appointmentDateTime",
    header: "APPOINTMENT DATE & TIME",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={`${getStatusBadgeClasses(
            status
          )} px-3 py-2 text-xs font-medium rounded-md`}
        >
          {formatStatusText(status)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const appt = row.original as Appointment;
      return <RowActions appt={appt} />;
    },
    enableSorting: false,
    enableHiding: false,
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
    accessorKey: "familyId",
    header: "FAMILY ID",
  },
  {
    accessorKey: "familyName",
    header: "FAMILY NAME",
  },
  {
    accessorKey: "numberOfMembers",
    header: "NUMBER OF MEMBERS",
  },
  {
    accessorKey: "appointmentDateTime",
    header: "APPOINTMENT DATE & TIME",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={`${getStatusBadgeClasses(
            status
          )} px-3 py-2 text-xs font-medium rounded-md`}
        >
          {formatStatusText(status)}
        </Badge>
      );
    },
  },
];

const RowActions: React.FC<{ appt: Appointment }> = ({ appt }) => {
  const toast = useToastHandler();
  const { mutateAsync: cancelAppt, isPending: cancelling } =
    useCancelAppointment();
  const { mutateAsync: completeAppt, isPending: completing } =
    useCompleteAppointment();

  type ErrorWithResponse = { response?: { data?: { message?: unknown } } };
  type ErrorWithMessage = { message?: unknown };
  
  const getErrorMessage = (e: unknown): string => {
    if (typeof e === "string") return e;
    const err = e as ErrorWithResponse & ErrorWithMessage;
    if (typeof err?.response?.data?.message === "string")
      return err.response.data.message as string;
    if (typeof err?.message === "string") return err.message as string;
    return "Something went wrong";
  };

  const onCancel = async () => {
    const ok =
      typeof window !== "undefined"
        ? window.confirm("Cancel this appointment?")
        : true;
    if (!ok) return;
    const userId = storeFunctions.getState().user?.id;
    if (!userId) {
      toast.error("Error", "Unable to determine current user");
      return;
    }
    try {
      await cancelAppt({ id: appt.id, data: { user_id: userId } });
      toast.success("Cancelled", "Appointment cancelled successfully");
    } catch (err: unknown) {
      toast.error("Error", getErrorMessage(err));
    }
  };

  const onComplete = async () => {
    const ok =
      typeof window !== "undefined"
        ? window.confirm("Mark this appointment as completed?")
        : true;
    if (!ok) return;
    try {
      await completeAppt(appt.id);
      toast.success("Completed", "Appointment marked as completed");
    } catch (err: unknown) {
      toast.error("Error", getErrorMessage(err));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          disabled={cancelling || completing}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onComplete}>
          Mark as Completed
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onCancel}
          className="text-red-600 focus:text-red-700"
        >
          Cancel Appointment
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <RescheduleAppointmentDialog appointment={appt}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Reschedule
          </DropdownMenuItem>
        </RescheduleAppointmentDialog>
        <DropdownMenuItem disabled>Update (coming soon)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
