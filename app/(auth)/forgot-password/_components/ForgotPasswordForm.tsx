"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserIcon } from "lucide-react";
import { FieldProps, Forge, FormPropsRef, useForge } from "@/lib/forge";
import { TextInput, TextInputProps } from "@/components/FormInputs/TextInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForgotPassword, ForgotPasswordCredentials } from "@/features/auth/service";
import { useToastHandler } from "@/hooks/useToaster";
import { ApiResponseError } from "@/types";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

type FormValues = yup.InferType<typeof schema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const toast = useToastHandler();
  const { mutateAsync, isPending } = useForgotPassword();
  const formRef = React.useRef<FormPropsRef | null>(null);

  const renderInputs: FieldProps<TextInputProps>[] = [
    {
      name: "email",
      type: "email",
      label: "Email Address",
      placeholder: "Enter your email",
      containerClass: "mb-5",
      component: TextInput,
      startAdornment: <UserIcon className="text-[#16C2D5] h-4 w-4 mr-1" />,
    },
  ];

  const { control } = useForge<FormValues>({
    resolver: yupResolver(schema),
    fields: renderInputs,
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      const response = await mutateAsync(data as ForgotPasswordCredentials);

      if (response.data.status) {
        toast.success("OTP Sent", "Please check your email for the verification code");
        // Navigate to OTP confirmation page
        setTimeout(() => {
          router.push(`/confirm-otp?email=${encodeURIComponent(data.email)}`);
        }, 1500);
      } else {
        toast.error("Request Failed", response.data.message as string);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      const err = error as ApiResponseError;
      const errorMessage =
        err.response?.data?.message || "An error occurred while processing your request";
      toast.error("Request Failed", errorMessage as string);
    }
  };

  return (
    <div className="min-w-sm flex justify-center flex-col">
      <header className="self-start">
        <h2 className="gap-2.5 self-stretch text-2xl font-semibold text-black">
          Forgot Password?
        </h2>
        <p className="text-sm font-medium text-black">
          Enter your email address and we&apos;ll send you a link to reset your password
        </p>
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
            {isPending ? "Sending..." : "Send Reset Link"}
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