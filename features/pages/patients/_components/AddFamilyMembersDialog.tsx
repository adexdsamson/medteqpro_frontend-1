/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, type ReactNode } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForge, Forge, Forger } from "@/lib/forge";
import { useToastHandler } from "@/hooks/useToaster";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MultiSelect } from "@/components/FormInputs/MultiSelect";
import { usePatientsForAppointment } from "@/features/services/patientService";
import { useAssignPatientsToFamily } from "@/features/services/patientService";
import { ApiResponseError } from "@/types";
import { Users } from "lucide-react";

const schema = yup.object().shape({
  patient_ids: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one patient")
    .required("Patient selection is required"),
});

type FormValues = {
  patient_ids: string[];
};

interface AddFamilyMembersDialogProps {
  familyId: string;
  familyName?: string;
  onMembersAdded?: () => void;
  trigger?: ReactNode;
}

/**
 * Dialog to add one or more existing patients to a family (assign family_id)
 */
export default function AddFamilyMembersDialog({
  familyId,
  familyName,
  onMembersAdded,
  trigger,
}: AddFamilyMembersDialogProps) {
  const [open, setOpen] = useState(false);
  const toast = useToastHandler();

  const { control, reset } = useForge<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      patient_ids: [],
    },
    mode: "onChange",
  });

  // Fetch patients options
  const { data: patientOptions = [], isLoading, isError } = usePatientsForAppointment();

  const { mutateAsync: assignPatients, isPending } = useAssignPatientsToFamily();

  const handleSubmit = async (form: FormValues) => {
    try {
      await assignPatients({ familyId, patientIds: form.patient_ids });
      toast.success("Success", "Patient(s) added to family successfully");
      setOpen(false);
      reset();
      onMembersAdded?.();
    } catch (error) {
      console.error("Error assigning patients to family:", error);
      const err = error as ApiResponseError;
      toast.error("Error", err?.message ?? "Failed to add patients to family");
    }
  };

  const defaultTrigger = (
    <Button variant="outline" className="gap-2">
      <Users className="h-4 w-4" />
      Add Members
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {familyName ? `Add Members to ${familyName}` : "Add Family Members"}
          </DialogTitle>
          <DialogDescription>
            Select existing patients to assign them to this family.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Forge control={control} onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <Forger
                name="patient_ids"
                component={MultiSelect}
                label="Patients"
                placeholder={isError ? "Failed to load patients" : "Select patients"}
                options={patientOptions}
                disabled={isLoading}
                required
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
                {isPending ? "Adding..." : "Add Members"}
              </Button>
            </div>
          </Forge>
        </div>
      </DialogContent>
    </Dialog>
  );
}