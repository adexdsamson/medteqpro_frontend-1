"use client";

import React, { useRef } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { useCreateHospitalStaff } from "@/features/services/staffService";
import { useToastHandler } from "@/hooks/useToaster";

// Define the form state structure
interface AddStaffFormState {
  first_name: string;
  last_name: string;
  email: string;
  position: string;
  phone_number: string;
  specialization: string;
}

const AddStaffDialog: React.FC = () => {
  const formFields: FieldProps<
    TextInputProps | TextSelectProps,
    AddStaffFormState
  >[] = [
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      placeholder: "Enter first name",
      component: TextInput,
      rules: { required: "First name is required" },
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      placeholder: "Enter last name",
      component: TextInput,
      rules: { required: "Last name is required" },
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter email address",
      component: TextInput,
      rules: {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      },
    },
    {
      name: "phone_number",
      label: "Phone Number",
      type: "tel",
      placeholder: "Enter phone number",
      component: TextInput,
      rules: { required: "Contact number is required" },
    },
    {
      name: "position",
      label: "Position/Role",
      placeholder: "Select position",
      component: TextSelect,
      options: [
        { label: "Doctor", value: "doctor" },
        { label: "Nurse", value: "nurse" },
        { label: "Front Desk", value: "front_desk" },
        { label: "Lab Scientist", value: "lab_scientist" },
        { label: "Pharmacist", value: "pharmacist" },
      ],
      rules: { required: "Position is required" },
    },
    {
      name: "specialization",
      label: "Specialization",
      type: "text",
      placeholder: "E.g., Cardiologist, Pediatrics, etc.",
      component: TextInput,
      rules: { required: "Specialization is required" },
    },
  ];

  const formRef = useRef<FormPropsRef>(null)
  const createStaffMutation = useCreateHospitalStaff();
  const { success, error } = useToastHandler();

  const { control } = useForge<AddStaffFormState>({
    fields: formFields,
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      position: "",
      phone_number: "",
      specialization: "", 
    },
  });

  const handleSubmit = async (data: AddStaffFormState) => {
    try {
      // Map the form data to API payload
      const payload = {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.position as "doctor" | "nurse" | "front_desk" | "lab_scientist" | "pharmacist",
      };

      await createStaffMutation.mutateAsync(payload);
      
      success(
        "Success",
        "Staff member invited successfully. They will receive an email to set their password."
      );
      
      // Close dialog after successful submission
      // Note: You might want to pass a close function as prop to handle this
    } catch (err: unknown) {
      error(
        "Failed to invite staff member",
        err
      );
    }
  };

  return (
    <DialogContent className="sm:max-w-[525px]">
      <DialogHeader>
        <DialogTitle>Add New Staff</DialogTitle>
        <DialogDescription>
          Fill in the details below to add a new staff member to the system.
        </DialogDescription>
      </DialogHeader>
      <Forge
        ref={formRef}
        control={control}
        onSubmit={handleSubmit}
        className="space-y-4 py-4"
      >
        {/* Form fields will be rendered by ForgeForm based on formFields config */}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            // type="submit"
            onClick={() => formRef.current?.onSubmit()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={createStaffMutation.isPending}
          >
            {createStaffMutation.isPending ? "Inviting..." : "Invite Staff"}
          </Button>
        </DialogFooter>
      </Forge>
    </DialogContent>
  );
};

export default AddStaffDialog;
