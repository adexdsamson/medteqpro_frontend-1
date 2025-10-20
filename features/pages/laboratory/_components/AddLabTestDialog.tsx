"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForge, Forge, Forger, FormPropsRef } from "@/lib/forge";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextArea } from "@/components/FormInputs/TextArea";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { TextDateInput } from "@/components/FormInputs/TextDateInput";
import { useToastHandler } from "@/hooks/useToaster";
import { ApiResponseError } from "@/types";
import { usePatientsForAppointment } from "@/features/services/patientService";
import { useGetLabTestTypes, useCreateLabManagementTest } from "@/features/services/labScientistService";
import { useHospitalStaffList } from "@/features/services/staffService";
import type { Resolver } from "react-hook-form";

/**
 * Validation schema for Laboratory Management lab test creation form
 */
const labTestSchema = yup.object().shape({
  patient: yup.string().uuid("Invalid patient identifier").required("Patient is required"),
  lab_no: yup.string().required("Lab number is required"),
  test_type: yup.string().required("Test type is required"),
  ordered_by: yup
    .string()
    .uuid("Invalid doctor identifier")
    .required("Ordered by is required"),
  specimen: yup.string().required("Specimen is required"),
  specimen_id: yup.string().optional(),
  specimen_type: yup
    .mixed<"blood" | "urine" | "stool" | "saliva" | "tissue" | "swab" | "other">()
    .optional(),
  entry_category: yup
    .mixed<"outpatient" | "inpatient" | "emergency">()
    .oneOf(["outpatient", "inpatient", "emergency"], "Invalid category")
    .required("Entry category is required"),
  date_collected: yup.string().required("Collection date is required"),
  test_date: yup.string().required("Test date is required"),
  percentage_completed: yup
    .number()
    .min(0, "Minimum is 0%")
    .max(100, "Maximum is 100%")
    .optional(),
  notes: yup.string().optional(),
});

/**
 * Form values inferred from schema
 */
export type LabTestFormValues = yup.InferType<typeof labTestSchema>;

/**
 * Props for the AddLabTestDialog component (Laboratory page)
 */
interface AddLabTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  patientId?: string
}

/**
 * AddLabTestDialog component for creating new lab tests from the Laboratory module.
 * It integrates with the Laboratory Management API via useCreateLabManagementTest and adheres strictly to the payload contract.
 *
 * @param props - Component props controlling dialog visibility and success callback
 * @returns The dialog UI to create a new lab test order
 * @example
 * <AddLabTestDialog open={open} onOpenChange={setOpen} onSuccess={() => refetch()} />
 */
export const AddLabTestDialog: React.FC<AddLabTestDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  patientId
}) => {
  const toast = useToastHandler();
  const formRef = useRef<FormPropsRef | null>(null);

  // Queries for select options
  const patientsQuery = usePatientsForAppointment();
  const testTypesQuery = useGetLabTestTypes();

  const patientOptions = patientsQuery.data ?? [];

  const testTypeOptions = useMemo(() => {
    const apiItems = testTypesQuery.data?.data?.results;
    if (Array.isArray(apiItems) && apiItems.length > 0) {
      return apiItems.map((t) => ({ value: t.id, label: t.test_name }));
    }
    return [];
  }, [testTypesQuery.data]);

  const doctorsQuery = useHospitalStaffList({ role: "doctor" });
  const doctorOptions = useMemo(() => {
    const items = doctorsQuery.data?.data?.results;
    if (Array.isArray(items) && items.length > 0) {
      return items.map((d) => ({
        value: d.id,
        label: d.full_name,
      }));
    }
    return [] as { value: string; label: string }[];
  }, [doctorsQuery.data]);

  const entryCategoryOptions = [
    { value: "outpatient", label: "Outpatient" },
    { value: "inpatient", label: "Inpatient" },
    { value: "emergency", label: "Emergency" },
  ];

  const specimenTypeOptions = [
    { value: "blood", label: "Blood" },
    { value: "urine", label: "Urine" },
    { value: "stool", label: "Stool" },
    { value: "saliva", label: "Saliva" },
    { value: "tissue", label: "Tissue" },
    { value: "swab", label: "Swab" },
    { value: "other", label: "Other" },
  ];

  const { control, setValue } = useForge<LabTestFormValues>({
    resolver: yupResolver(labTestSchema) as Resolver<LabTestFormValues>,
    defaultValues: {
      patient: "",
      lab_no: "",
      test_type: "",
      ordered_by: "",
      specimen: "",
      specimen_id: "",
      specimen_type: undefined,
      entry_category: "outpatient",
      date_collected: "",
      test_date: "",
      percentage_completed: undefined,
      notes: "",
    },
  });

  useEffect(() => {
    if (patientId) {
      setValue("patient", patientId);
    }
  }, [patientId, setValue]);

  // Mutation
  const createLabManagementTest = useCreateLabManagementTest();

  /**
   * Handle form submission: constructs Laboratory Mgt API-compliant payload and calls mutation
   * @param data - Lab test form values
   * @throws ApiResponseError - When API request fails
   */
  const handleSubmit = async (data: LabTestFormValues) => {
    try {
      await createLabManagementTest.mutateAsync({
        lab_no: data.lab_no,
        patient_id: data.patient,
        ordered_by: data.ordered_by,
        test_type: data.test_type,
        entry_category: data.entry_category,
        date_collected: data.date_collected,
        specimen: data.specimen,
        specimen_id: data.specimen_id || undefined,
        specimen_type: data.specimen_type ?? undefined,
        status: "draft",
        percentage_completed:
          typeof data.percentage_completed === "number"
            ? data.percentage_completed
            : undefined,
        test_date: data.test_date,
        notes: data.notes || undefined,
      });

      toast.success("Success", "Lab test created successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating lab test:", error);
      const err = error as ApiResponseError;
      toast.error("Error", err?.message ?? "Failed to create lab test");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Lab Test</DialogTitle>
          <DialogDescription>
            Create a new laboratory test record. Fill in all required fields to
            proceed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Forge {...{ control, onSubmit: handleSubmit, ref: formRef, debug: true }}>
            <div className="grid grid-cols-2 gap-4">
              <Forger
                name="patient"
                component={TextSelect}
                label="Patient"
                placeholder={
                  patientsQuery.isLoading
                    ? "Loading patients..."
                    : "Select patient"
                }
                options={patientOptions}
                required
              />

              <Forger
                name="lab_no"
                component={TextInput}
                label="Lab Number"
                placeholder="Enter lab number"
                required
              />

              <Forger
                name="test_type"
                component={TextSelect}
                label="Test Type"
                placeholder={
                  testTypesQuery.isLoading
                    ? "Loading test types..."
                    : "Select test type"
                }
                options={testTypeOptions}
                required
              />

              <Forger
                name="ordered_by"
                component={TextSelect}
                label="Ordered By (Doctor)"
                placeholder={
                  doctorsQuery.isLoading ? "Loading doctors..." : "Select doctor"
                }
                options={doctorOptions}
                required
              />

              <Forger
                name="entry_category"
                component={TextSelect}
                label="Entry Category"
                placeholder="Select entry category"
                options={entryCategoryOptions}
                required
              />

              <Forger
                name="date_collected"
                component={TextDateInput}
                label="Collection Date"
                placeholder="Select collection date"
                required
              />

              <Forger
                name="test_date"
                component={TextDateInput}
                label="Test Date"
                placeholder="Select test date"
                required
              />

              <Forger
                name="specimen"
                component={TextInput}
                label="Specimen"
                placeholder="Enter specimen description"
                required
              />

              <Forger
                name="specimen_type"
                component={TextSelect}
                label="Specimen Type"
                placeholder="Select specimen type"
                options={specimenTypeOptions}
              />

              <Forger
                name="specimen_id"
                component={TextInput}
                label="Specimen ID"
                placeholder="Enter specimen ID (optional)"
              />

              <Forger
                name="percentage_completed"
                component={TextInput}
                label="% Completed"
                placeholder="0 - 100"
                type="number"
                min={0}
                max={100}
              />

              <div className="col-span-2">
                <Forger
                  name="notes"
                  component={TextArea}
                  label="Notes"
                  placeholder="Enter any additional notes (optional)"
                />
              </div>
            </div>
          </Forge>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createLabManagementTest.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => formRef.current?.onSubmit()}
              disabled={createLabManagementTest.isPending}
            >
              {createLabManagementTest.isPending
                ? "Creating..."
                : "Create Lab Test"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddLabTestDialog;
