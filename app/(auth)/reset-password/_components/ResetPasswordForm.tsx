/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LockIcon } from "lucide-react";
import { FieldProps, Forge, FormPropsRef, useForge } from "@/lib/forge";
import { TextInput, TextInputProps } from "@/components/FormInputs/TextInput";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useResetPassword, ResetPasswordCredentials } from "@/features/auth/service";
import { useToastHandler } from "@/hooks/useToaster";
import { ApiResponseError } from "@/types";

const schema = yup.object().shape({
  new_password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords must match")
    .required("Please confirm your password"),
});

type FormValues = yup.InferType<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToastHandler();
  const { mutateAsync, isPending } = useResetPassword();
  const formRef = React.useRef<FormPropsRef | null>(null);

  // Get token, user_id, and email from URL parameters
  const tokenFromUrl = searchParams.get("token") || "";
  const userIdFromUrl = searchParams.get("user_id") || "";
  const emailFromUrl = searchParams.get("email") || "";

  const renderInputs: FieldProps<TextInputProps>[] = [
    {
      name: "new_password",
      type: "password",
      label: "New Password",
      placeholder: "Enter new password",
      containerClass: "mb-5",
      component: TextInput,
      startAdornment: <LockIcon className="text-[#16C2D5] h-4 w-4 mr-1" />,
    },
    {
      name: "confirm_password",
      type: "password",
      label: "Confirm Password",
      placeholder: "Confirm new password",
      containerClass: "mb-5",
      component: TextInput,
      startAdornment: <LockIcon className="text-[#16C2D5] h-4 w-4 mr-1" />,
    },
  ];

  const { control } = useForge<FormValues>({
    resolver: yupResolver(schema),
    fields: renderInputs,
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      const { confirm_password: _, ...resetData } = data;
      // Add the token and user_id from URL to the reset data
      const resetPayload = { ...resetData, token: tokenFromUrl, user_id: userIdFromUrl };
      const response = await mutateAsync(resetPayload as ResetPasswordCredentials);

      if (response.data.status) {
        toast.success("Password Reset Successful", "Your password has been reset successfully");
        // Redirect to login page
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      } else {
        toast.error("Reset Failed", response.data.message as string);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      const err = error as ApiResponseError;
      const errorMessage =
        err.response?.data?.message || "An error occurred while resetting your password";
      toast.error("Reset Failed", errorMessage as string);
    }
  };

  return (
    <div className="min-w-sm flex justify-center flex-col">
      <header className="self-start">
        <h2 className="gap-2.5 self-stretch text-2xl font-semibold text-black">
          Reset Password
        </h2>
        <p className="text-sm font-medium text-black">
          Enter your new password
        </p>
        {emailFromUrl && (
          <p className="text-xs text-gray-600 mt-1">
            Resetting password for: {emailFromUrl}
          </p>
        )}
      </header>

      <Card className="mt-7 w-full text-xs max-w-[400px] border-none shadow-none bg-transparent">
        <CardContent className="p-0 space-y-2.5">
          <Forge control={control} onSubmit={handleSubmit} ref={formRef} />

          <Button
            onClick={() => {
              formRef.current?.onSubmit();
            }}
            loading={isPending}
            className="gap-2.5 self-stretch p-2.5 mt-5 w-full font-semibold whitespace-nowrap rounded-md bg-slate-400 text-slate-200 hover:bg-slate-500 disabled:opacity-50"
          >
            {isPending ? "Resetting..." : "Reset Password"}
          </Button>

          <div className="flex items-center justify-center mt-4">
            <Link href="/sign-in" className="font-medium text-teal-600">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}