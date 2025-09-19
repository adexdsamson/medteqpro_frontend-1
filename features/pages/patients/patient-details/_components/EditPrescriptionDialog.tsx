/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextArea } from "@/components/FormInputs/TextArea";
import { useForge, Forge, Forger } from "@/lib/forge";
import { 
  useUpdatePrescription, 
  UpdatePrescriptionRequest,
  PrescriptionType 
} from "@/features/services/prescriptionService";
import { useToastHandler } from "@/hooks/useToaster";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ApiResponseError } from "@/types";
import { Edit } from "lucide-react";

// Form validation schema
const schema = yup.object().shape({
  medicine_name: yup.string().required("Medicine name is required"),
  dosage: yup.string().required("Dosage is required"),
  frequency: yup.string().required("Frequency is required"),
  duration: yup.number().required("Duration is required").positive("Duration must be positive"),
  notes: yup.string().optional(),
});

type FormValues = {
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: number;
  notes?: string;
};

interface EditPrescriptionDialogProps {
  patientId: string;
  prescription: PrescriptionType;
  onPrescriptionUpdated?: () => void;
  trigger?: React.ReactNode;
}

/**
 * EditPrescriptionDialog component for updating existing prescriptions
 * @param patientId - The ID of the patient
 * @param prescription - The prescription data to edit
 * @param onPrescriptionUpdated - Callback function called after successful update
 * @param trigger - Custom trigger element for the dialog
 */
export default function EditPrescriptionDialog({
  patientId,
  prescription,
  onPrescriptionUpdated,
  trigger,
}: EditPrescriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const toast = useToastHandler();
  const updatePrescriptionMutation = useUpdatePrescription();

  // Initialize form with prescription data
  const { control, reset } = useForge<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      medicine_name: prescription.medicineName,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      notes: prescription.notes || "",
    },
  });

  // Reset form when prescription changes
  useEffect(() => {
    reset({
      medicine_name: prescription.medicineName,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      notes: prescription.notes || "",
    });
  }, [prescription, reset]);

  /**
   * Handles form submission for updating prescription
   * @param data - Form data containing prescription updates
   */
  const handleSubmit = async (data: FormValues) => {
    try {
      const updateData: UpdatePrescriptionRequest = {
        medicine_name: data.medicine_name,
        dosage: data.dosage,
        frequency: data.frequency,
        duration: data.duration,
        notes: data.notes,
      };

      await updatePrescriptionMutation.mutateAsync({
        patientId,
        prescriptionId: prescription.id,
        data: updateData,
      });

      toast.success("Success", "Prescription updated successfully");
      setOpen(false);
      onPrescriptionUpdated?.();
    } catch (error) {
      console.error("Error updating prescription:", error);
      const err = error as ApiResponseError;
      toast.error("Error", err?.message ?? "Failed to update prescription");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit Prescription</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <Forge control={control} onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <Forger
                name="medicine_name"
                component={TextInput}
                label="Medicine Name"
                placeholder="Enter medicine name"
              />
              
              <Forger
                name="dosage"
                component={TextInput}
                label="Dosage"
                placeholder="e.g., 500mg"
              />
              
              <Forger
                name="frequency"
                component={TextInput}
                label="Frequency"
                placeholder="e.g., Twice daily"
              />
              
              <Forger
                name="duration"
                component={TextInput}
                label="Duration (days)"
                placeholder="e.g., 7"
                type="number"
              />
              
              <Forger
                name="notes"
                component={TextArea}
                label="Notes (Optional)"
                placeholder="Additional instructions or notes"
              />
            </div>
          </Forge>
        </div>

        <div className="flex-shrink-0 flex justify-end gap-2 pt-4 border-t bg-white">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={updatePrescriptionMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => control._formState.isValid && handleSubmit(control._formValues as FormValues)}
            disabled={updatePrescriptionMutation.isPending}
          >
            {updatePrescriptionMutation.isPending ? "Updating..." : "Update Prescription"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}