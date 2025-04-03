/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserIcon, LockIcon } from "lucide-react";
import { FaApple } from "react-icons/fa";
import { FieldProps, useForge } from "@/lib/forge";
import { TextInput, TextInputProps } from "@/components/FormInputs/TextInput";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter()
  const renderInputs: FieldProps<TextInputProps>[] = [
    {
      name: "username",
      type: "text",
      label: "Username/Phone number",
      placeholder: "Username",
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

  const { ForgeForm } = useForge({
    fieldProps: renderInputs,
  });

  const handleClick = (e: any) => {
    e.preventDefault()
    router.push('/super-admin/dashboard')
  }

  return (
    <div className="min-w-sm">
      <header className="self-start">
        <h2 className="gap-2.5 self-stretch text-2xl font-semibold text-black">
          Hi, Welcome Back
        </h2>
        <p className="text-sm font-medium text-black">Please login here</p>
      </header>

      <Card className="mt-7 w-full text-xs max-w-[400px] border-none shadow-none bg-transparent">
        <CardContent className="p-0 space-y-2.5">
          <ForgeForm onSubmit={() => {}} />
          <div className="flex items-center">
            <Link href="/" className="mt- font-medium text-teal-600">
              Forgot Password?
            </Link>
          </div>

          <Button onClick={handleClick} className="gap-2.5 self-stretch p-2.5 mt-5 w-full font-semibold whitespace-nowrap rounded-md bg-slate-400 text-slate-200 hover:bg-slate-500">
            Login
          </Button>
        </CardContent>
      </Card>

      <div className="mt-10 mb-10 relative">
        <span className="bg-[#F1F4F8] px-4 absolute -top-2.5 mx-auto w-fit block text-xs right-5/12">or with</span>
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
}

const SocialIcon = ({ onClick, icon }: SocialIconProps) => {
  return (
    <div onClick={onClick} className="border border-gray-400 rounded-full p-3 cursor-pointer">
      {icon}
    </div>
  );
};
