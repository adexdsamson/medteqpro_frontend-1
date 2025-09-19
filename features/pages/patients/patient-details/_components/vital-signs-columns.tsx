"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, SquareStackIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VitalSignsResponse } from "@/features/services/vitalSignsService";
import { ConfirmAlert } from "@/components/ConfirmAlert";
import { useToastHandler } from "@/hooks/useToaster";
import { useParams } from "next/navigation";
import { useUser } from "@/store/authSlice";
import {
  AddQueueEntryRequest,
  useAddQueueEntry,
} from "@/features/services/queueService";
import { useDeleteVitalSigns } from "@/features/services/vitalSignsService";

export const columns: ColumnDef<VitalSignsResponse>[] = [
  {
    accessorKey: "created_at",
    header: "DATE & TIME",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return <div>{`${formattedDate} ${formattedTime}`}</div>;
    },
  },
  {
    accessorKey: "body_temperature",
    header: "BODY TEMP (C)",
  },
  {
    accessorKey: "pulse_rate",
    header: "PULSE RATE (B/M)",
  },
  {
    accessorKey: "blood_pressure",
    header: "BLOOD PRESSURE (mm/Hg)",
    cell: ({ row }) => {
      const vitalSign = row.original;
      return (
        <div>{`${vitalSign.systolic_blood_pressure}/${vitalSign.diastolic_blood_pressure}`}</div>
      );
    },
  },
  {
    accessorKey: "oxygen_saturation",
    header: "OXYGEN SATURATION (%)",
  },
  {
    id: "actions",
    header: "ACTION",
    cell: ({ row }) => {
      const vitalSign = row.original;
      return <RowActions vitalSign={vitalSign} />;
    },
  },
];

/**
 * RowActions component for Vital Signs table rows.
 * Provides actions to send patient to queue and delete a vital sign record.
 * Hooks are used within this component to comply with React rules.
 * @param {{ vitalSign: VitalSignsResponse }} props
 * @returns {JSX.Element}
 * @example
 * <RowActions vitalSign={row.original} />
 */
const RowActions = ({ vitalSign }: { vitalSign: VitalSignsResponse }) => {
  const toast = useToastHandler();
  const params = useParams();
  const patientId = (params as { patientId?: string })?.patientId as string;
  const user = useUser();

  const { mutateAsync: addQueueEntry, isPending: isSending } =
    useAddQueueEntry();
  const { mutateAsync: deleteVital, isPending: isDeleting } =
    useDeleteVitalSigns();

  /**
   * Send current patient to the queue with default purpose and priority.
   * @throws Error when the API request fails
   */
  const handleSendToQueue = async () => {
    try {
      if (!patientId) return toast.error("Missing patient ID");
      if (!user?.id) return toast.error("Missing staff ID");

      const payload: AddQueueEntryRequest = {
        patient: patientId,
        hospital_staff: user.id,
        purpose: "vital-signs",
        priority: "low",
        estimated_waiting_time: 0,
      };

      const res = await addQueueEntry(payload);
      if (res?.status) {
        toast.success("Success", "Patient sent to queue successfully");
      } else {
        throw new Error(res?.message || "Failed to send to queue");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send patient to queue";
      toast.error("Error", message);
    }
  };

  /**
   * Delete the selected vital sign record.
   * @throws Error when the API request fails
   */
  const handleDelete = async () => {
    try {
      if (!patientId) return toast.error("Missing patient ID");
      await deleteVital({ patientId, vitalSignsId: vitalSign.id });
      toast.success("Deleted", "Vital sign deleted successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete vital sign";
      toast.error("Error", message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ConfirmAlert
          title="Send to queue"
          text="Are you sure you want to send this patient to the queue?"
          icon={SquareStackIcon}
          trigger={
            <Button variant={'ghost'} disabled={isSending}>
              Send to queue
            </Button>
          }
          onConfirm={handleSendToQueue}
          confirmText="Yes, send"
          cancelText="Cancel"
        />
        <DropdownMenuSeparator />
        <ConfirmAlert
          title="Delete vital sign"
          text="This action cannot be undone. Do you want to delete this vital sign record?"
          trigger={
            <Button variant={'ghost'} disabled={isDeleting} className="text-red-600">
              Delete
            </Button>
          }
          onConfirm={handleDelete}
          confirmText="Yes, delete"
          cancelText="Cancel"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

