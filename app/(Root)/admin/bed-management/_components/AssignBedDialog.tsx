"use client";

import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { TextDateInput } from "@/components/FormInputs/TextDateInput";
import { usePatientList } from "@/features/services/patientService";
import { useAssignBed } from "@/features/services/bedManagementService";
import { useToastHandler } from "@/hooks/useToaster";
import { useForge, Forge, Forger, FormPropsRef } from "@/lib/forge";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import * as yup from "yup";

// Form validation schema
const schema = yup.object().shape({
  patient_id: yup.string().required("Patient is required"),
  expected_end_date: yup.date().required("Expected end date is required"),
});

type FormValues = yup.InferType<typeof schema>;

interface AssignBedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wardId: string;
  bedId: string;
}

const AssignBedDialog: React.FC<AssignBedDialogProps> = ({
  open,
  onOpenChange,
  wardId,
  bedId,
}) => {
  const toast = useToastHandler();
  const queryClient = useQueryClient();
  const formRef = useRef<FormPropsRef | null>(null);

  // Form state management with Forge
  const { control } = useForge<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      patient_id: "",
      expected_end_date: undefined,
    },
  });

  // Fetch patients based on search
  const { data: patients = [] } = usePatientList();

  // Assign bed mutation using props
  const assignBedMutation = useAssignBed(wardId, bedId);

  // Patient options for dropdown
  const patientOptions = patients.map((patient) => ({
    label: `${patient.full_name} (${patient.id})`,
    value: patient.id,
  }));

  const handleSubmit = async (data: FormValues) => {
    try {
      // Convert date to ISO string
      const expectedEndDate = new Date(data.expected_end_date).toISOString();

      await assignBedMutation.mutateAsync({
        patient_id: data.patient_id,
        expected_end_date: expectedEndDate,
      });

      // Refetch bed data after successful assignment
      await queryClient.invalidateQueries({
        queryKey: ["bedsInWard", wardId],
      });

      // Also invalidate all wards to update bed counts
      await queryClient.invalidateQueries({
        queryKey: ["allWards"],
      });

      toast.success("Success", "Bed assigned successfully");
      onOpenChange(false);
    } catch {
      toast.error("Error", "Failed to assign bed. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-2xl p-8">
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-2xl font-normal text-gray-800">
            Assign Bed
          </DialogTitle>
        </DialogHeader>

        <Forge control={control} onSubmit={handleSubmit} ref={formRef}>
          <div className="space-y-6">
            {/* Patient ID/Name */}
            <div className="mt-2">
              <Forger
                name="patient_id"
                component={TextSelect}
                placeholder="Select Patient"
                options={patientOptions}
              />
            </div>

            {/* Expected End Date */}
            <div>
              <Forger
                name="expected_end_date"
                component={TextDateInput}
                label="Expected End Date"
                placeholder="MM/DD/YYYY"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 bg-gray-600 text-white hover:bg-gray-700 border-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={assignBedMutation.isPending}
            >
              {assignBedMutation.isPending ? "Assigning..." : "Assign"}
            </Button>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
};

export default AssignBedDialog;
