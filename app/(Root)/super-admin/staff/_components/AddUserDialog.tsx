/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { useForge, Forge, Forger } from "@/lib/forge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useToastHandler } from "@/hooks/useToaster";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Form validation schema
const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  role: yup.string().required("User permission is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

type FormValues = yup.InferType<typeof schema>;

interface AddUserDialogProps {
  children: React.ReactNode;
}

export default function AddUserDialog({ children }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const toast = useToastHandler();
  const queryClient = useQueryClient();

  const { control, reset, formState } = useForge<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      password: "",
    },
  });

  const { mutateAsync, isPending } = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    FormValues
  >({
    mutationKey: ["create-staff"],
    mutationFn: async (payload) =>
      await postRequest({ url: "/auth/onboard/staff/", payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-list"] });
      toast.success("Success", "Staff member added successfully");
      setOpen(false);
      reset();
    },
    onError: (error) => {
      toast.error("Error", error.message || "Failed to add staff member");
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      // Split full name into first and last name for API
      await mutateAsync({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role: data.role,
        password: data.password
      });
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  console.log({ formState })

  const roleOptions = [
    { label: "Super Admin", value: "superadmin" },
    { label: "Admin", value: "admin" },
    { label: "Support", value: "support" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-medium text-gray-900">
            Add New User
          </DialogTitle>
        </DialogHeader>
        
        <Forge control={control} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Forger
              name="first_name"
              component={TextInput}
              label="First Name"
              placeholder="Name"
            />

            <Forger
              name="last_name"
              component={TextInput}
              label="Last Name"
              placeholder="Name"
            />
            
            <Forger
              name="email"
              component={TextInput}
              label="Email"
              placeholder="Email"
              type="email"
            />
            
            <Forger
              name="role"
              component={TextSelect}
              label="User Permissions"
              placeholder="Select Option"
              options={roleOptions}
            />
            
            <Forger
              name="password"
              component={TextInput}
              label="Status"
              placeholder="DD/MM/YYYY"
              type="date"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isPending}
            >
              {isPending ? "Adding..." : "Add"}
            </Button>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
}