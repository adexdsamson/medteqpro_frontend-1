"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserIcon, LockIcon } from "lucide-react";
import { FaApple } from "react-icons/fa";
import { FieldProps, Forge, FormPropsRef, useForge } from "@/lib/forge";
import { TextInput, TextInputProps } from "@/components/FormInputs/TextInput";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLogin, LoginCredentials } from "@/features/auth/service";
import { useToastHandler } from "@/hooks/useToaster";
import { ApiResponseError } from "@/types";
import { storeFunctions } from "@/store/authSlice";
import { buildRolePath, getRoleBasePath } from "@/lib/utils";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

type FormValues = yup.InferType<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const toast = useToastHandler();
  const { mutateAsync, isPending } = useLogin();
  const { setToken, setUser } = storeFunctions();
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
    {
      name: "password",
      type: "password",
      label: "Password/Pin",
      placeholder: "Password",
      component: TextInput,
      startAdornment: <LockIcon className="text-[#16C2D5] h-4 w-4 mr-1" />,
    },
  ];

  const { control } = useForge<FormValues>({
    resolver: yupResolver(schema),
    fields: renderInputs,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      const response = await mutateAsync(data as LoginCredentials);

      if (response.data.status) {
        // Store authentication data
        setToken(response.data.data.access_token);
        setUser(response.data.data.user);

        toast.success("Login Successful", "Welcome back!");
        handleRoleSelect(response.data.data.user.role);
      } else {
        toast.error("Login Failed", response.data.message as string);
      }
    } catch (error) {
      console.error("Login error:", error);
      const err = error as ApiResponseError;
      const errorMessage =
        err.response?.data?.message || "An error occurred during login";
      toast.error("Login Failed", errorMessage as string);
    }
  };

  const handleRoleSelect = (role: string) => {
    // Default to base dashboard if mapping exists, else fallback home
    const base = getRoleBasePath(role);
    if (base) {
      // Prefer dashboard if available, else fallback to a common landing page for the role
      const dashboard = buildRolePath(role, role === "front_desk" ?  "patients" :"dashboard");
      router.push(dashboard ?? base);
      return;
    }
    router.push("/");
  };

  return (
    <div className="min-w-sm flex justify-center flex-col">
      <header className="self-start">
        <h2 className="gap-2.5 self-stretch text-2xl font-semibold text-black">
          Hi, Welcome Back
        </h2>
        <p className="text-sm font-medium text-black">Please login here</p>
      </header>

      <Card className="mt-7 w-full text-xs max-w-[400px] border-none shadow-none bg-transparent">
        <CardContent className="p-0 space-y-2.5">
          <Forge control={control} onSubmit={handleSubmit} ref={formRef} />
          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className="mt- font-medium text-teal-600"
            >
              Forgot Password?
            </Link>
            <Link
              href="/patient-registration"
              className="font-semibold text-[#0D277F] hover:underline"
            >
              New Patient? Register
            </Link>
          </div>

          <Button
            onClick={() => {
              formRef.current?.onSubmit();
            }}
            loading={isPending}
            className="gap-2.5 self-stretch p-2.5 mt-5 w-full font-semibold whitespace-nowrap rounded-md bg-slate-400 text-slate-200 hover:bg-slate-500 disabled:opacity-50"
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>

      <div className="mt-8 mb-8 relative">
        <span className="bg-[#F1F4F8] px-4 absolute -top-2.5 mx-auto w-fit block text-xs right-5/12">
          or with
        </span>
        <hr className="" />
      </div>

      <div className="flex items-center gap-3 justify-center">
        <SocialIcon icon={<FaApple size={24} />} onClick={() => {}} />
        <SocialIcon icon={<FcGoogle size={24} />} onClick={() => {}} />
      </div>
    </div>
  );
}

type SocialIconProps = {
  onClick: () => void;
  icon: React.ReactNode;
};

const SocialIcon = ({ onClick, icon }: SocialIconProps) => {
  return (
    <div
      onClick={onClick}
      className="border border-gray-400 rounded-full p-3 cursor-pointer"
    >
      {icon}
    </div>
  );
};
