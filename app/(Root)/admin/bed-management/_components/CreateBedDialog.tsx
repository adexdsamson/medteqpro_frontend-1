"use client";

import React, { useRef, useState } from "react";
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
import { 
  useCreateBedInWard, 
  BedCreationType,
  useGetAllWards 
} from "@/features/services/bedManagementService";
import { useToastHandler } from "@/hooks/useToaster";
import { useQueryClient } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Define the form state structure
interface CreateBedFormState {
  ward_id: string;
  bed_number: string;
  room_number: string;
}

// Validation schema
const schema = yup.object().shape({
  ward_id: yup
    .string()
    .required("Ward is required"),
  bed_number: yup
    .string()
    .required("Bed number is required")
    .min(1, "Bed number must be at least 1 character"),
  room_number: yup
    .string()
    .required("Room number is required")
    .min(1, "Room number must be at least 1 character"),
});

interface CreateBedDialogProps {
  onClose?: () => void;
}

const CreateBedDialog: React.FC<CreateBedDialogProps> = ({ onClose }) => {
  const formRef = useRef<FormPropsRef>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [selectedWardId, setSelectedWardId] = useState<string>("");
  
  const { data: wardsResponse } = useGetAllWards();
  const createBedMutation = useCreateBedInWard();
  const { success, error } = useToastHandler();
  const queryClient = useQueryClient();

  // Prepare ward options for the select
  const wardOptions = wardsResponse?.data?.data?.map(ward => ({
    label: ward.name,
    value: ward.id
  })) || [];

  const formFields: FieldProps<
    TextInputProps | TextSelectProps,
    CreateBedFormState
  >[] = [
    {
      name: "ward_id",
      label: "Ward",
      placeholder: "Select ward",
      component: TextSelect,
      options: wardOptions,
      rules: { required: "Ward is required" },
    },
    {
      name: "bed_number",
      label: "Bed Number",
      type: "text",
      placeholder: "e.g., A1, B2, C3",
      component: TextInput,
      rules: { required: "Bed number is required" },
    },
    {
      name: "room_number",
      label: "Room Number",
      type: "text",
      placeholder: "e.g., 100, 101, 102",
      component: TextInput,
      rules: { required: "Room number is required" },
    },
  ];

  const { control } = useForge<CreateBedFormState>({
    fields: formFields,
    defaultValues: {
      ward_id: "",
      bed_number: "",
      room_number: "",
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = async (data: CreateBedFormState) => {
    try {
      // Update the selected ward ID if it's different
      if (selectedWardId !== data.ward_id) {
        setSelectedWardId(data.ward_id);
      }
      
      // Map the form data to API payload
      const payload: BedCreationType = {
        bed_number: data.bed_number,
        room_number: data.room_number,
        wardId: data.ward_id,
      };

      await createBedMutation.mutateAsync(payload);
      
      // Invalidate queries to refresh the data
      await queryClient.invalidateQueries({ queryKey: ["allWards"] });
      await queryClient.invalidateQueries({ queryKey: ["bedsInWard", data.ward_id] });
      
      success(
        "Success",
        "Bed created successfully."
      );
      
      // Close dialog after successful submission
      if (onClose) {
        onClose();
      }
      closeRef.current?.click();
    } catch (err: unknown) {
      error(
        "Failed to create bed",
        err
      );
    }
  };

  return (
    <DialogContent className="sm:max-w-[525px]">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-gray-900">
          Create Bed
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
            disabled={createBedMutation.isPending}
          >
            {createBedMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </Forge>
      <DialogClose ref={closeRef} />
    </DialogContent>
  );
};

export default CreateBedDialog;