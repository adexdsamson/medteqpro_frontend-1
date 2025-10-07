/**
 * ChangePasswordForm component for handling password changes in the profile settings
 * Uses the Forge form system with validation and API integration
 */
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Forge, useForge, Forger } from "@/lib/forge";
import { TextInput } from "@/components/FormInputs/TextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToastHandler } from "@/hooks/useToaster";
import { useChangePassword, ChangePasswordPayload } from "@/features/services/profileService";
import { ApiResponseError } from "@/types";
import * as yup from "yup";

/**
 * Validation schema for password change form
 */
const changePasswordSchema = yup.object().shape({
  old_password: yup
    .string()
    .required("Current password is required"),
  new_password: yup
    .string()
    .min(8, "New password must be at least 8 characters")
    .required("New password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords must match")
    .required("Please confirm your new password"),
});

type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>;

/**
 * ChangePasswordForm component
 * @returns JSX.Element
 */
export function ChangePasswordForm() {
  const toast = useToastHandler();
  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const { control } = useForge<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  /**
   * Handles form submission for password change
   * @param values - Form values containing old and new passwords
   */
  const handleSubmit = async (values: ChangePasswordFormValues) => {
    try {
      const payload: ChangePasswordPayload = {
        old_password: values.old_password,
        new_password: values.new_password,
      };

      await changePassword(payload);
      toast.success("Success", "Password changed successfully");
      
      // Reset form after successful password change
      control._reset();
    } catch (error) {
      console.log(error);
      const err = error as ApiResponseError;
      toast.error("Error", err?.message || "Failed to change password");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
        <p className="text-sm text-gray-600 mt-1">
          Update your password to keep your account secure
        </p>
      </div>

      <Forge 
        control={control} 
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <Forger
          name="old_password"
          component={TextInput}
          label="Current Password"
          placeholder="Enter your current password"
          type="password"
        />
        
        <Forger
          name="new_password"
          component={TextInput}
          label="New Password"
          placeholder="Enter your new password"
          type="password"
        />
        
        <Forger
          name="confirm_password"
          component={TextInput}
          label="Confirm New Password"
          placeholder="Confirm your new password"
          type="password"
        />

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={isPending}
            className="min-w-[120px]"
          >
            {isPending ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </Forge>
    </div>
  );
}