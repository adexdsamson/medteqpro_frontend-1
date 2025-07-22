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
import { useSetPassword, SetPasswordCredentials } from "@/features/auth/service";
import { useToastHandler } from "@/hooks/useToaster";
import { ApiResponseError } from "@/types";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

type FormValues = yup.InferType<typeof schema>;

export function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToastHandler();
  const { mutateAsync, isPending } = useSetPassword();
  const formRef = React.useRef<FormPropsRef | null>(null);

  // Get uid and token from URL parameters
  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";

  const renderInputs: FieldProps<TextInputProps>[] = [
    {
      name: "password",
      type: "password",
      label: "New Password",
      placeholder: "Enter your password",
      containerClass: "mb-5",
      component: TextInput,
      startAdornment: <LockIcon className="text-[#16C2D5] h-4 w-4 mr-1" />,
    },
    {
      name: "confirm_password",
      type: "password",
      label: "Confirm Password",
      placeholder: "Confirm your password",
      containerClass: "mb-5",
      component: TextInput,
      startAdornment: <LockIcon className="text-[#16C2D5] h-4 w-4 mr-1" />,
    },
  ];

  const { control } = useForge<FormValues>({
    resolver: yupResolver(schema),
    fields: renderInputs,
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    if (!uid || !token) {
      toast.error("Invalid Link", "The invitation link is invalid or expired");
      return;
    }

    try {
      const setPasswordPayload = { 
        uid, 
        token, 
        password: data.password 
      };
      
      const response = await mutateAsync(setPasswordPayload as SetPasswordCredentials);

      if (response.data.status) {
        toast.success("Password Set Successfully", "Your password has been set. You can now log in.");
        // Redirect to login page
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      } else {
        toast.error("Setup Failed", response.data.message as string);
      }
    } catch (error) {
      console.error("Set password error:", error);
      const err = error as ApiResponseError;
      const errorMessage =
        err.response?.data?.message || "An error occurred while setting your password";
      toast.error("Setup Failed", errorMessage as string);
    }
  };

  return (
    <div className="min-w-sm flex justify-center flex-col">
      <header className="self-start">
        <h2 className="gap-2.5 self-stretch text-2xl font-semibold text-black">
          Set Your Password
        </h2>
        <p className="text-sm font-medium text-black">
          Create a secure password for your account
        </p>
      </header>

      <Card className="mt-7 w-full text-xs max-w-[400px] border-none shadow-none bg-transparent">
        <CardContent className="p-0 space-y-2.5">
          <Forge control={control} onSubmit={handleSubmit} ref={formRef} debug/>

          <Button
            onClick={() => {
              formRef.current?.onSubmit();
            }}
            loading={isPending}
            className="gap-2.5 self-stretch p-2.5 mt-5 w-full font-semibold whitespace-nowrap rounded-md bg-slate-400 text-slate-200 hover:bg-slate-500 disabled:opacity-50"
          >
            {isPending ? "Setting Password..." : "Set Password"}
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