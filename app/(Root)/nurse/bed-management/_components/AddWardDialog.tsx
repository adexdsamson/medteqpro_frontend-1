"use client";

import React, { useRef } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextInput, TextInputProps } from "@/components/FormInputs/TextInput";
import {
  TextSelect,
  TextSelectProps,
} from "@/components/FormInputs/TextSelect";
import { useForge, FieldProps, Forge, FormPropsRef } from "@/lib/forge";
import { useCreateWard, WardCreationType } from "@/features/services/bedManagementService";
import { useToastHandler } from "@/hooks/useToaster";
import { useQueryClient } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Define the form state structure
interface AddWardFormState {
  name: string;
  ward_type: string;
}

// Validation schema
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Ward name is required")
    .min(2, "Ward name must be at least 2 characters"),
  ward_type: yup
    .string()
    .required("Ward type is required"),
});

interface AddWardDialogProps {
  onClose?: () => void;
}

const AddWardDialog: React.FC<AddWardDialogProps> = ({ onClose }) => {
  const formFields: FieldProps<
    TextInputProps | TextSelectProps,
    AddWardFormState
  >[] = [
    {
      name: "name",
      label: "Ward Name",
      type: "text",
      placeholder: "Ward Name",
      component: TextInput,
      rules: { required: "Ward name is required" },
    },
    {
      name: "ward_type",
      label: "Ward Type",
      placeholder: "Select ward type",
      component: TextSelect,
      options: [
        { label: "General", value: "general" },
        { label: "Maternity", value: "maternity" },
        { label: "ICU", value: "icu" },
        { label: "Emergency", value: "emergency" },
        { label: "Pediatric", value: "pediatric" },
        { label: "Surgery", value: "surgery" },
      ],
      rules: { required: "Ward type is required" },
    },

  ];

  const formRef = useRef<FormPropsRef>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const createWardMutation = useCreateWard();
  const { success, error } = useToastHandler();
  const queryClient = useQueryClient();

  const { control } = useForge<AddWardFormState>({
    fields: formFields,
    defaultValues: {
      name: "",
      ward_type: "",
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = async (data: AddWardFormState) => {
    try {
      // Map the form data to API payload
      const payload: WardCreationType = {
        name: data.name,
        ward_type: data.ward_type,
      };

      await createWardMutation.mutateAsync(payload);
      
      // Invalidate queries to refresh the data
      await queryClient.invalidateQueries({ queryKey: ["allWards"] });
      
      success(
        "Success",
        "Ward created successfully."
      );
      
      // Close dialog after successful submission
      if (onClose) {
        onClose();
      }
      closeRef.current?.click();
    } catch (err: unknown) {
      error(
        "Failed to create ward",
        err
      );
    }
  };

  return (
    <DialogContent className="sm:max-w-[525px]">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-gray-900">
          Add Ward
        </DialogTitle>
      </DialogHeader>
      <Forge
        ref={formRef}
        control={control}
        onSubmit={handleSubmit}
        className="space-y-6 py-4"
      >
        <DialogFooter className="flex gap-3 pt-6">
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="outline"
              className="flex-1 bg-gray-600 text-white hover:bg-gray-700 border-gray-600"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => formRef.current?.onSubmit()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={createWardMutation.isPending}
          >
            {createWardMutation.isPending ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </Forge>
      <DialogClose ref={closeRef} />
    </DialogContent>
  );
};

export default AddWardDialog;