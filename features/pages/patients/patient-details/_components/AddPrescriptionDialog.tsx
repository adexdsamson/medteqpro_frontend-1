/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForge, Forge, Forger } from "@/lib/forge";
import { useToastHandler } from "@/hooks/useToaster";
import {
  useCreatePrescription,
  CreatePrescriptionRequest,
} from "@/features/services/prescriptionService";
import { ApiResponseError } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextArea } from "@/components/FormInputs/TextArea";
import { Plus } from "lucide-react";

const schema = yup.object().shape({
  medicine_name: yup.string().required("Medicine name is required"),
  dosage: yup
    .string()
    .max(100, "Dosage cannot exceed 100 characters")
    .required("Dosage is required"),
  frequency: yup.string().required("Frequency is required"),
  duration: yup
    .number()
    .required("Duration is required")
    .positive("Duration must be a positive number")
    .integer("Duration must be a whole number"),
  notes: yup.string().notRequired(),
});

type FormValues = {
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: number;
  notes?: string;
};

interface AddPrescriptionDialogProps {
  patientId: string;
  onPrescriptionCreated?: () => void;
}

/**
 * Dialog component for adding new prescriptions
 * @param patientId - The ID of the patient
 * @param onPrescriptionCreated - Callback function called after successful prescription creation
 */
export default function AddPrescriptionDialog({
  patientId,
  onPrescriptionCreated,
}: AddPrescriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const toast = useToastHandler();

  const { control, reset } = useForge<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      medicine_name: "",
      dosage: "",
      frequency: "",
      duration: 0,
      notes: "",
    },
    mode: "onChange",
  });

  const { mutateAsync: createPrescription, isPending } =
    useCreatePrescription();

  /**
   * Handles form submission for creating a new prescription
   * @param data - Form data containing prescription details
   */
  const handleSubmit = async (data: FormValues) => {
    try {
      const payload: CreatePrescriptionRequest = {
        medicine_name: data.medicine_name,
        dosage: data.dosage,
        frequency: data.frequency,
        duration: data.duration,
        ...(data.notes && { notes: data.notes }),
      };

      await createPrescription({ patientId, data: payload });

      toast.success("Success", "Prescription created successfully");
      setOpen(false);
      reset();
      onPrescriptionCreated?.();
    } catch (error) {
      console.error("Error creating prescription:", error);
      const err = error as ApiResponseError;
      toast.error("Error", err?.message ?? "Failed to create prescription");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Prescription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add New Prescription</DialogTitle>
          <DialogDescription>
            Create a new prescription for this patient. Fill in the required
            information below.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Forge control={control} onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <Forger
                name="medicine_name"
                component={TextInput}
                label="Medicine Name"
                placeholder="Enter medicine name"
                required
              />

              <Forger
                name="dosage"
                component={TextInput}
                label="Dosage"
                placeholder="e.g., 500mg, 2 tablets"
                required
              />

              <Forger
                name="frequency"
                component={TextInput}
                label="Frequency"
                placeholder="e.g., Twice daily, Every 8 hours"
                required
              />

              <Forger
                name="duration"
                component={TextInput}
                label="Duration (days)"
                placeholder="Enter duration in days"
                type="number"
                required
              />

              <Forger
                name="notes"
                component={TextArea}
                label="Notes"
                placeholder="Additional notes (optional)"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t bg-white sticky bottom-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Prescription"}
              </Button>
            </div>
          </Forge>
        </div>
      </DialogContent>
    </Dialog>
  );
}
