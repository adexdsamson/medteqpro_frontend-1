/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { MultiSelect } from "@/components/FormInputs/MultiSelect";
import { TextArea } from "@/components/FormInputs/TextArea";
import { TextDateInput } from "@/components/FormInputs/TextDateInput";
import { useForge, Forge, Forger, FormPropsRef } from "@/lib/forge";
import { useCreateWoundRecord, CreateWoundRecordPayload } from "@/features/services/woundCareService";
import { usePatientsForAppointment } from "@/features/services/patientService";
import { useToastHandler } from "@/hooks/useToaster";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ApiResponseError } from "@/types";
import { format } from "date-fns";

// Form validation schema based on API documentation
const schema = yup.object().shape({
  patient_id: yup.string().required("Patient is required"),
  date_recorded: yup.date().required("Date recorded is required"),
  description_tags: yup.array().of(yup.string().required()).min(1, "At least one description tag is required").required(),
  affecting_factors_tags: yup.array().of(yup.string().required()).min(1, "At least one affecting factor is required").required(),
  previous_treatment: yup.string().required("Previous treatment is required"),
  size_in_mm: yup.string().required("Size in mm is required"),
  width: yup.string().required("Width is required"),
  depth: yup.string().required("Depth is required"),
  wound_bed_assessment: yup.string().required("Wound bed assessment is required"),
  exudate_amount: yup.string().oneOf(["none", "scant", "small", "moderate", "large", "copious"]).required("Exudate amount is required"),
  consistency: yup.string().oneOf(["serous", "sanguineous", "serosanguineous", "purulent", "haemopurulent", "other"]).required("Consistency is required"),
  odour: yup.string().oneOf(["none", "mild", "moderate", "strong", "foul"]).required("Odour is required"),
  infection_signs_tags: yup.array().of(yup.string().required()).min(1, "At least one infection sign is required").required(),
  edges_description_tags: yup.array().of(yup.string().required()).min(1, "At least one edge description is required").required(),
  wound_condition_overall: yup.string().required("Overall wound condition is required"),
  edge_condition_overall: yup.string().required("Overall edge condition is required"),
  treatment_plan: yup.string().required("Treatment plan is required"),
  dressing_type: yup.string().required("Dressing type is required"),
  dressing_change_reason: yup.string().required("Dressing change reason is required"),
  dressing_frequency: yup.string().required("Dressing frequency is required"),
  follow_up_needed: yup.string().oneOf(["Yes", "No"]).required("Follow up needed is required"),
  follow_up_date: yup.string().optional().when("follow_up_needed", {
    is: "Yes",
    then: (schema) => schema.required("Follow up date is required when follow up is needed"),
    otherwise: (schema) => schema.optional(),
  }),
  follow_up_notes: yup.string().optional().when("follow_up_needed", {
    is: "Yes",
    then: (schema) => schema.required("Follow up notes are required when follow up is needed"),
    otherwise: (schema) => schema.optional(),
  }),
});

type FormValues = yup.InferType<typeof schema>;



interface CreateWoundRecordDialogProps {
  children: React.ReactNode;
}

export default function CreateWoundRecordDialog({ children }: CreateWoundRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const toast = useToastHandler();
  const formRef = useRef<FormPropsRef | null>(null);

  // Fetch patients for dropdown
  const { data: patients = [] } = usePatientsForAppointment();

  // Create wound record mutation
  const createWoundRecordMutation = useCreateWoundRecord();

  // Form state management with Forge
  const { control } = useForge<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      patient_id: "",
      date_recorded: new Date(),
      description_tags: [] as string[],
      affecting_factors_tags: [] as string[],
      previous_treatment: "",
      size_in_mm: "",
      width: "",
      depth: "",
      wound_bed_assessment: "",
      exudate_amount: "none",
      consistency: "serous",
      odour: "none",
      infection_signs_tags: [] as string[],
      edges_description_tags: [] as string[],
      wound_condition_overall: "",
      edge_condition_overall: "",
      treatment_plan: "",
      dressing_type: "",
      dressing_change_reason: "",
      dressing_frequency: "",
      follow_up_needed: "No",
      follow_up_date: undefined,
      follow_up_notes: undefined,
    },
  });

  // Options for dropdowns based on API documentation
  const exudateAmountOptions = [
    { label: "None", value: "none" },
    { label: "Scant", value: "scant" },
    { label: "Small", value: "small" },
    { label: "Moderate", value: "moderate" },
    { label: "Large", value: "large" },
    { label: "Copious", value: "copious" },
  ];

  const consistencyOptions = [
    { label: "Serous", value: "serous" },
    { label: "Sanguineous", value: "sanguineous" },
    { label: "Serosanguineous", value: "serosanguineous" },
    { label: "Purulent", value: "purulent" },
    { label: "Haemopurulent", value: "haemopurulent" },
    { label: "Other", value: "other" },
  ];

  const odourOptions = [
    { label: "None", value: "none" },
    { label: "Mild", value: "mild" },
    { label: "Moderate", value: "moderate" },
    { label: "Strong", value: "strong" },
    { label: "Foul", value: "foul" },
  ];

  const followUpOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  // Common tag options based on API examples
  const descriptionTagOptions = [
    { label: "Abrasion", value: "Abrasion" },
    { label: "Laceration", value: "Laceration" },
    { label: "Puncture", value: "Puncture" },
    { label: "Surgical Incision", value: "Surgical Incision" },
    { label: "Burn", value: "Burn" },
    { label: "Pressure Ulcer", value: "Pressure Ulcer" },
  ];

  const affectingFactorsOptions = [
    { label: "Diabetes", value: "Diabetes" },
    { label: "Poor Nutrition", value: "Poor Nutrition" },
    { label: "Smoking", value: "Smoking" },
    { label: "Age", value: "Age" },
    { label: "Infection", value: "Infection" },
    { label: "Medication", value: "Medication" },
  ];

  const infectionSignsOptions = [
    { label: "Redness", value: "Redness" },
    { label: "Swelling", value: "Swelling" },
    { label: "Pus", value: "Pus" },
    { label: "Warmth", value: "Warmth" },
    { label: "Increased Pain", value: "Increased Pain" },
    { label: "Fever", value: "Fever" },
  ];

  const edgesDescriptionOptions = [
    { label: "Defined", value: "Defined" },
    { label: "Undermined", value: "Undermined" },
    { label: "Macerated", value: "Macerated" },
    { label: "Rolled", value: "Rolled" },
    { label: "Attached", value: "Attached" },
    { label: "Irregular", value: "Irregular" },
  ];

  const handleSubmit = async (data: FormValues) => {
    try {
      // Transform form data to match API payload
      const payload: CreateWoundRecordPayload = {
        ...data,
        date_recorded: format(data.date_recorded, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        description_tags: data.description_tags,
        affecting_factors_tags: data.affecting_factors_tags,
        infection_signs_tags: data.infection_signs_tags,
        edges_description_tags: data.edges_description_tags,
        follow_up_date: data.follow_up_needed === "Yes" ? (data.follow_up_date || "") : "",
        follow_up_notes: data.follow_up_needed === "Yes" ? (data.follow_up_notes || "") : "",
      };

      await createWoundRecordMutation.mutateAsync(payload);
      toast.success("Success", "Wound record created successfully");
      setOpen(false);
      setStep(1);
    } catch (error) {
      console.log(error);
      const err = error as ApiResponseError;
      toast.error("Error", err?.message ?? "Failed to create wound record");
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleDialogSubmit = () => {
    if (step < 3) {
      nextStep();
    } else {
      formRef.current?.onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-medium text-gray-900">
            Create Wound Record - Step {step} of 3
          </DialogTitle>
        </DialogHeader>

        <Forge control={control} onSubmit={handleSubmit} ref={formRef} className="space-y-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-700">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="patient_id"
                  component={TextSelect}
                  label="Patient"
                  placeholder="Select Patient"
                  options={patients}
                />
                
                <Forger
                  name="date_recorded"
                  component={TextDateInput}
                  label="Date Recorded"
                  placeholder="Select Date"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="description_tags"
                  component={MultiSelect}
                  label="Description Tags"
                  placeholder="Select Description Tags"
                  options={descriptionTagOptions}
                />
                
                <Forger
                  name="affecting_factors_tags"
                  component={MultiSelect}
                  label="Affecting Factors"
                  placeholder="Select Affecting Factors"
                  options={affectingFactorsOptions}
                />
              </div>

              <Forger
                name="previous_treatment"
                component={TextArea}
                label="Previous Treatment"
                placeholder="Describe previous treatment"
              />

              <div className="grid grid-cols-3 gap-4">
                <Forger
                  name="size_in_mm"
                  component={TextInput}
                  label="Size (mm)"
                  placeholder="Size in mm"
                  type="number"
                />
                
                <Forger
                  name="width"
                  component={TextInput}
                  label="Width (mm)"
                  placeholder="Width in mm"
                  type="number"
                />
                
                <Forger
                  name="depth"
                  component={TextInput}
                  label="Depth (mm)"
                  placeholder="Depth in mm"
                  type="number"
                />
              </div>
            </div>
          )}

          {/* Step 2: Assessment Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-700">Assessment Details</h3>
              
              <Forger
                name="wound_bed_assessment"
                component={TextArea}
                label="Wound Bed Assessment"
                placeholder="Describe wound bed assessment"
              />

              <div className="grid grid-cols-3 gap-4">
                <Forger
                  name="exudate_amount"
                  component={TextSelect}
                  label="Exudate Amount"
                  placeholder="Select Amount"
                  options={exudateAmountOptions}
                />
                
                <Forger
                  name="consistency"
                  component={TextSelect}
                  label="Consistency"
                  placeholder="Select Consistency"
                  options={consistencyOptions}
                />
                
                <Forger
                  name="odour"
                  component={TextSelect}
                  label="Odour"
                  placeholder="Select Odour"
                  options={odourOptions}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="infection_signs_tags"
                  component={MultiSelect}
                  label="Infection Signs"
                  placeholder="Select Infection Signs"
                  options={infectionSignsOptions}
                />
                
                <Forger
                  name="edges_description_tags"
                  component={MultiSelect}
                  label="Edge Description"
                  placeholder="Select Edge Description"
                  options={edgesDescriptionOptions}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="wound_condition_overall"
                  component={TextArea}
                  label="Overall Wound Condition"
                  placeholder="Describe overall wound condition"
                />
                
                <Forger
                  name="edge_condition_overall"
                  component={TextArea}
                  label="Overall Edge Condition"
                  placeholder="Describe overall edge condition"
                />
              </div>
            </div>
          )}

          {/* Step 3: Treatment & Follow-up */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-700">Treatment & Follow-up</h3>
              
              <Forger
                name="treatment_plan"
                component={TextArea}
                label="Treatment Plan"
                placeholder="Describe treatment plan"
              />

              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="dressing_type"
                  component={TextInput}
                  label="Dressing Type"
                  placeholder="Enter dressing type"
                />
                
                <Forger
                  name="dressing_frequency"
                  component={TextInput}
                  label="Dressing Frequency"
                  placeholder="e.g., Every 2 days"
                />
              </div>

              <Forger
                name="dressing_change_reason"
                component={TextArea}
                label="Dressing Change Reason"
                placeholder="Reason for dressing change"
              />

              <Forger
                name="follow_up_needed"
                component={TextSelect}
                label="Follow-up Needed"
                placeholder="Select Option"
                options={followUpOptions}
              />

              <div className="grid grid-cols-2 gap-4">
                <Forger
                  name="follow_up_date"
                  component={TextInput}
                  label="Follow-up Date"
                  placeholder="YYYY-MM-DD"
                  type="date"
                />
                
                <Forger
                  name="follow_up_notes"
                  component={TextArea}
                  label="Follow-up Notes"
                  placeholder="Follow-up notes"
                />
              </div>
            </div>
          )}
        </Forge>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            
            <Button
              type="button"
              onClick={handleDialogSubmit}
              disabled={createWoundRecordMutation.isPending}
            >
              {createWoundRecordMutation.isPending
                ? "Creating..."
                : step === 3
                ? "Create Record"
                : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}