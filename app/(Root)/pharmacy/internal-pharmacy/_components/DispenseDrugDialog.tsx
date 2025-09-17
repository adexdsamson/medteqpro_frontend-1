/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForge, Forge, Forger } from "@/lib/forge";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextArea } from "@/components/FormInputs/TextArea";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { useToastHandler } from "@/hooks/useToaster";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useGetDrugs, Drug, DrugAdministration } from "@/features/services/drugManagementService";
import { usePatientsForAppointment } from "@/features/services/patientService";

interface DispenseDrugDialogProps {
  children?: React.ReactNode;
}

const schema = yup.object().shape({
  drug_id: yup.string().required("Drug is required"),
  patient_id: yup.string().required("Patient is required"),
  dosage: yup.string().required("Dosage is required"),
  frequency: yup.string().required("Frequency is required"),
  quantity_administered: yup.number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity administered is required"),
  notes: yup.string().optional(),
});

export type DispenseDrugFormData = yup.InferType<typeof schema>;

const frequencyOptions = [
  { value: "once_daily", label: "Once Daily" },
  { value: "twice_daily", label: "Twice Daily" },
  { value: "three_times_daily", label: "Three Times Daily" },
  { value: "four_times_daily", label: "Four Times Daily" },
  { value: "every_4_hours", label: "Every 4 Hours" },
  { value: "every_6_hours", label: "Every 6 Hours" },
  { value: "every_8_hours", label: "Every 8 Hours" },
  { value: "every_12_hours", label: "Every 12 Hours" },
  { value: "as_needed", label: "As Needed" },
  { value: "before_meals", label: "Before Meals" },
  { value: "after_meals", label: "After Meals" },
  { value: "at_bedtime", label: "At Bedtime" },
];

export default function DispenseDrugDialog({ children }: DispenseDrugDialogProps) {
  const [open, setOpen] = useState(false);
  const toast = useToastHandler();
  const queryClient = useQueryClient();

  const { control } = useForge<DispenseDrugFormData>({
    resolver: yupResolver(schema) as any,
  });

  // Get drugs for dropdown
  const { data: drugsData, isLoading: isDrugsLoading } = useGetDrugs({
    page: 1,
  });

  // Get patients for dropdown
  const { data: patientsData, isLoading: isPatientsLoading } = usePatientsForAppointment();

  const drugOptions = drugsData?.data?.results?.map((drug: Drug) => ({
    value: drug.id.toString(),
    label: `${drug.drug_name} - ${drug.drug_type}`,
  })) || [];

  const patientOptions = patientsData?.map((patient) => ({
    value: patient.value,
    label: patient.label,
  })) || [];

  const { mutateAsync: dispenseDrug } = useMutation<
    ApiResponse<DrugAdministration>,
    ApiResponseError,
    DispenseDrugFormData
  >({
    mutationKey: ["dispenseDrug"],
    mutationFn: async (data) =>
      await postRequest({ url: "/pharmacy/dispense-drug", payload: data }),
  });

  const handleSubmit = async (data: DispenseDrugFormData) => {
    try {
      await dispenseDrug(data);
      toast.success("Success", "Drug dispensed successfully");
      queryClient.invalidateQueries({ queryKey: ["getDrugs"] });
      queryClient.invalidateQueries({ queryKey: ["getDrugAdministrations"] });
      setOpen(false);
    } catch (error) {
      console.error("Error dispensing drug:", error);
      const err = error as { message?: string };
      toast.error("Error", err?.message ?? "Failed to dispense drug");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Dispense Drug
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Dispense Drug</DialogTitle>
          <DialogDescription>
            Dispense medication to a patient. Select the drug, patient, and specify the dosage and administration details.
          </DialogDescription>
        </DialogHeader>
        
        <Forge control={control} onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="drug_id"
                component={TextSelect}
                label="Drug"
                placeholder={isDrugsLoading ? "Loading drugs..." : "Select drug"}
                options={drugOptions}
                disabled={isDrugsLoading}
              />
              <Forger
                name="patient_id"
                component={TextSelect}
                label="Patient"
                placeholder={isPatientsLoading ? "Loading patients..." : "Select patient"}
                options={patientOptions}
                disabled={isPatientsLoading}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="dosage"
                component={TextInput}
                label="Dosage"
                placeholder="e.g., 500mg, 2 tablets, 5ml"
              />
              <Forger
                name="frequency"
                component={TextSelect}
                label="Frequency"
                placeholder="Select frequency"
                options={frequencyOptions}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="quantity_administered"
                component={TextInput}
                label="Quantity Administered"
                placeholder="Enter quantity"
                type="number"
                min="1"
              />
              <div></div> {/* Empty div for grid alignment */}
            </div>
            
            <Forger
              name="notes"
              component={TextArea}
              label="Notes (Optional)"
              placeholder="Additional notes or instructions..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Dispense Drug
            </Button>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
}