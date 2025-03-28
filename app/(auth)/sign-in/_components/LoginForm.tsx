"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserIcon, LockIcon } from "lucide-react";
import Image from "next/image";

export function LoginForm() {
  return (
    <div className="flex flex-col max-md:mx-2 bg-fuchsia-600 h-ful">
      <header className="self-start">
        <h2 className="gap-2.5 self-stretch text-2xl font-semibold text-black">
          Hi, Welcome Back
        </h2>
        <p className="text-sm font-medium text-black">Please login here</p>
      </header>

      <Card className="mt-7 w-full text-xs max-w-[290px] border-none shadow-none bg-transparent">
        <CardContent className="p-0 space-y-2.5">
          <div className="w-full">
            <div className="w-full">
              <div className="w-full">
                <label
                  className="font-semibold text-zinc-700"
                  htmlFor="username"
                >
                  Username/Phone number
                </label>
                <div className="flex gap-2.5 items-center p-2.5 mt-1 w-full font-medium whitespace-nowrap bg-white rounded text-neutral-400">
                  <div className="flex gap-2.5 justify-center items-center self-stretch my-auto">
                    <UserIcon />
                    <span className="self-stretch my-auto">Username</span>
                  </div>
                </div>
              </div>

              <div className="mt-2.5 w-full whitespace-nowrap">
                <label
                  className="font-semibold text-zinc-700"
                  htmlFor="password"
                >
                  Password/Pin
                </label>
                <div className="flex gap-2.5 items-center p-2.5 mt-1 w-full font-medium bg-white rounded text-neutral-400">
                  <div className="flex gap-2.5 justify-center items-center self-stretch my-auto">
                    <LockIcon />
                    <span className="self-stretch my-auto">**********</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-2 font-medium text-teal-600">
              Forgot Password?
            </button>
          </div>

          <Button className="gap-2.5 self-stretch p-2.5 mt-5 w-full font-semibold whitespace-nowrap rounded-md bg-slate-400 text-slate-200 hover:bg-slate-500">
            Login
          </Button>
        </CardContent>
      </Card>

      <Image
        src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/4b4ad4cd5c7e5105d6e54d37e2d2e2303e0b47b7?placeholderIfAbsent=true"
        alt="Alternative login option"
        height={100}
        width={100}
        className="object-contain self-center mt-8 max-w-full aspect-[2.38] w-[100px]"
      />
    </div>
  );
}
