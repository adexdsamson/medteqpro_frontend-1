"use client";

import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextInput, TextInputProps } from "@/components/FormInputs/TextInput";
import { TextSelect, TextSelectProps } from '@/components/FormInputs/TextSelect';
import { useForge, FieldProps, Forge } from "@/lib/forge";
import { StaffStatus } from './columns'; // Assuming StaffStatus is exported from columns.tsx

// Define the form state structure
interface AddStaffFormState {
  name: string;
  email: string;
  position: string;
  contact: string;
  status: StaffStatus;
}

const AddStaffDialog: React.FC = () => {
  const formFields: FieldProps<TextInputProps | TextSelectProps, AddStaffFormState>[] = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter full name",
      component: TextInput,
      rules: { required: 'Full name is required' }
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter email address",
      component: TextInput,
      rules: { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } }
    },
    {
      name: "position",
      label: "Position/Role",
      type: "text",
      placeholder: "E.g., Doctor, Nurse, Admin Staff",
      component: TextInput,
      rules: { required: 'Position is required' }
    },
    {
      name: "contact",
      label: "Contact Number",
      type: "tel",
      placeholder: "Enter phone number",
      component: TextInput,
      rules: { required: 'Contact number is required' }
    },
    {
      name: "status",
      label: "Initial Status",
      placeholder: "Select status",
      component: TextSelect,
      options: Object.values(StaffStatus).map(status => ({ label: status, value: status })),
      rules: { required: 'Status is required' }
    },
  ];

  const { control, } = useForge<AddStaffFormState>({
    fieldProps: formFields,
    defaultValues: {
      name: "",
      email: "",
      position: "",
      contact: "",
      status: StaffStatus.Present, // Default to Present
    },
  });

  const handleSubmit = (data: AddStaffFormState) => {
    console.log("Add Staff Data:", data);
    // Here you would typically call an API to save the new staff member
    // e.g., using useMutation from react-query
    // After successful submission, you might want to close the dialog and refresh the staff list
  };

  return (
    <DialogContent className="sm:max-w-[525px]">
      <DialogHeader>
        <DialogTitle>Add New Staff</DialogTitle>
        <DialogDescription>
          Fill in the details below to add a new staff member to the system.
        </DialogDescription>
      </DialogHeader>
      <Forge control={control} onSubmit={handleSubmit} className="space-y-4 py-4">
        {/* Form fields will be rendered by ForgeForm based on formFields config */}
      </Forge>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit"  className="bg-blue-600 hover:bg-blue-700 text-white">
          Add Staff
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddStaffDialog;