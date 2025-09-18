"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PrescriptionType, useDeletePrescription } from "@/features/services/prescriptionService";
import EditPrescriptionDialog from "./EditPrescriptionDialog";
import { ConfirmAlert } from "@/components/ConfirmAlert";
import { useToastHandler } from "@/hooks/useToaster";
import { ApiResponseError } from "@/types";

/**
 * Actions cell component for prescription table
 */
const PrescriptionActionsCell = ({ prescription, patientId }: { prescription: PrescriptionType; patientId: string }) => {
  const toast = useToastHandler();
  const deletePrescriptionMutation = useDeletePrescription();

  /**
   * Handles prescription deletion with confirmation
   */
  const handleDelete = async () => {
    try {
      await deletePrescriptionMutation.mutateAsync({
        patientId,
        prescriptionId: prescription.id,
      });
      toast.success("Success", "Prescription deleted successfully");
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error("Error", err?.message ?? "Failed to delete prescription");
    }
  };

  /**
   * Handles prescription update completion
   */
  const handlePrescriptionUpdated = () => {
    // The mutation will automatically invalidate queries and refresh the data
    toast.success("Success", "Prescription list updated");
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
        <EditPrescriptionDialog
          patientId={patientId}
          prescription={prescription}
          onPrescriptionUpdated={handlePrescriptionUpdated}
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          }
        />
        <ConfirmAlert
          title="Delete Prescription"
          text="Are you sure you want to delete this prescription? This action cannot be undone."
          onConfirm={handleDelete}
          confirmText="Delete"
          cancelText="Cancel"
          trigger={
            <DropdownMenuItem 
              onSelect={(e) => e.preventDefault()}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/**
 * Creates prescription table columns with actions for a specific patient
 * @param patientId - The ID of the patient
 * @returns Array of column definitions for the prescription table
 */
export const createPrescriptionColumns = (patientId: string): ColumnDef<PrescriptionType>[] => [
  {
    accessorKey: "formattedCreatedAt",
    header: "DATE & TIME",
    cell: ({ row }) => {
      const dateTime = row.getValue("formattedCreatedAt") as string;
      return (
        <div className="text-sm text-gray-900">
          {dateTime}
        </div>
      );
    },
  },
  {
    accessorKey: "medicineName",
    header: "MEDICINE",
    cell: ({ row }) => {
      const medicine = row.getValue("medicineName") as string;
      return (
        <div className="text-sm font-medium text-gray-900">
          {medicine}
        </div>
      );
    },
  },
  {
    accessorKey: "dosage",
    header: "DOSAGE",
    cell: ({ row }) => {
      const dosage = row.getValue("dosage") as string;
      return (
        <div className="text-sm text-gray-900">
          {dosage}
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "NO OF DAYS",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number;
      return (
        <div className="text-sm text-gray-900">
          {duration} {duration === 1 ? 'day' : 'days'}
        </div>
      );
    },
  },
  {
    accessorKey: "frequency",
    header: "FREQUENCY",
    cell: ({ row }) => {
      const frequency = row.getValue("frequency") as string;
      return (
        <div className="text-sm text-gray-900">
          {frequency}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => {
      const prescription = row.original;
      return <PrescriptionActionsCell prescription={prescription} patientId={patientId} />;
    },
  },
];