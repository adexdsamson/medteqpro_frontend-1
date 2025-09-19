"use client";

import React, { useState } from "react";
import { useForge, Forge, Forger } from "@/lib/forge";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRequest } from "@/lib/axiosInstance";
import { useToastHandler } from "@/hooks/useToaster";
import { ApiResponse, ApiResponseError } from "@/types";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { TextArea } from "@/components/FormInputs/TextArea";

/**
 * Form validation schema for test type creation
 */
const testTypeSchema = yup.object().shape({
  test_name: yup.string().required("Test name is required"),
  test_type: yup.string().required("Test type is required"),
  description: yup.string().required("Description is required"),
  is_active: yup.string().default("true"),
});

type TestTypeFormValues = yup.InferType<typeof testTypeSchema>;

/**
 * Test type data structure for API
 */
interface TestType {
  id?: string;
  test_name: string;
  test_type: string;
  description: string;
  is_active: string;
}

interface AddTestTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

/**
 * Test type options based on API documentation
 */
const testTypeOptions = [
  { value: "hematology", label: "Hematology" },
  { value: "biochemistry", label: "Biochemistry" },
  { value: "microbiology", label: "Microbiology" },
  { value: "immunology", label: "Immunology" },
  { value: "pathology", label: "Pathology" },
  { value: "radiology", label: "Radiology" },
  { value: "other", label: "Other" },
];

/**
 * AddTestTypeDialog component for creating new test types
 * Provides a form interface for adding laboratory test types
 * @param open - Controls dialog visibility
 * @param onOpenChange - Callback for dialog state changes
 * @param onSuccess - Optional callback for successful creation
 * @returns JSX element containing the test type creation dialog
 */
export default function AddTestTypeDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddTestTypeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToastHandler();
  const queryClient = useQueryClient();

  const { control, reset } = useForge<TestTypeFormValues>({
    resolver: yupResolver(testTypeSchema),
    defaultValues: {
      test_name: "",
      test_type: "",
      description: "",
      is_active: "true",
    },
  });

  const { mutateAsync } = useMutation<
    ApiResponse<TestType>,
    ApiResponseError,
    TestTypeFormValues
  >({
    mutationKey: ["createTestType"],
    mutationFn: async (data) =>
      await postRequest({
        url: "/laboratory-management/test-types/",
        payload: data,
      }),
  });

  /**
   * Handles form submission for test type creation
   * @param data - Form data containing test type information
   */
  const handleSubmit = async (data: TestTypeFormValues) => {
    try {
      setIsSubmitting(true);
      await mutateAsync(data);
      // Invalidate lab test types list so UI refreshes
      await queryClient.invalidateQueries({ queryKey: ["lab-test-types"] });
      toast.success("Success", "Test type created successfully");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating test type:", error);
      const err = error as ApiResponseError;
      toast.error("Error", err?.message ?? "Failed to create test type");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles dialog close and resets form
   */
  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Test Type</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Forge control={control} onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Forger
                name="test_name"
                component={TextInput}
                label="Test Name"
                placeholder="Enter test name (e.g., Lipid Profile)"
                required
              />

              <Forger
                name="test_type"
                component={TextSelect}
                label="Test Type"
                placeholder="Select test type"
                options={testTypeOptions}
                required
              />

              <Forger
                name="description"
                component={TextArea}
                label="Description"
                placeholder="Enter test description"
                required
              />

              <Forger
                name="is_active"
                component={TextSelect}
                label="Active Status"
                placeholder="Select status"
                options={[
                  { value: "true", label: "Active" },
                  { value: "false", label: "Inactive" },
                ]}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Creating..." : "Create Test Type"}
              </Button>
            </div>
          </Forge>
        </div>
      </DialogContent>
    </Dialog>
  );
}