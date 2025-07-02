"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OTPInput } from "@/components/ui/otp-input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useConfirmOTP, ConfirmOTPCredentials } from "@/features/auth/service";
import { useToastHandler } from "@/hooks/useToaster";
import { ApiResponseError } from "@/types";

export function ConfirmOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToastHandler();
  const { mutateAsync, isPending } = useConfirmOTP();
  
  const [otp, setOtp] = React.useState("");
  const [email, setEmail] = React.useState("");

  // Get email from URL parameters
  React.useEffect(() => {
    const emailFromUrl = searchParams.get("email") || "";
    setEmail(emailFromUrl);
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Missing Email", "Email address is required");
      return;
    }

    if (!otp || otp.length !== 6) {
      toast.error("Invalid OTP", "Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await mutateAsync({ email, otp } as ConfirmOTPCredentials);

      if (response.data.status) {
        toast.success("OTP Verified", "OTP verified successfully");
        // Navigate to reset password page with token and user_id
        const token = response.data.data?.token || "";
        const userId = response.data.data?.user_id || "";
        router.push(`/reset-password?token=${encodeURIComponent(token)}&user_id=${encodeURIComponent(userId)}&email=${encodeURIComponent(email)}`);
      } else {
        toast.error("Verification Failed", response.data.message as string);
      }
    } catch (error) {
      console.error("Confirm OTP error:", error);
      const err = error as ApiResponseError;
      const errorMessage =
        err.response?.data?.message || "An error occurred while verifying OTP";
      toast.error("Verification Failed", errorMessage as string);
    }
  };

  const handleResendOTP = () => {
    // Navigate back to forgot password page to resend OTP
    router.push(`/forgot-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-w-sm flex justify-center flex-col">
      <header className="self-start text-center">
        <h2 className="gap-2.5 self-stretch text-2xl font-semibold text-black">
          Verify OTP
        </h2>
        <p className="text-sm font-medium text-black mt-2">
          Enter the 6-digit code sent to your email
        </p>
        {email && (
          <p className="text-xs text-gray-600 mt-1">
            {email}
          </p>
        )}
      </header>

      <Card className="mt-7 w-full text-xs max-w-[400px] border-none shadow-none bg-transparent">
        <CardContent className="p-0 space-y-2.5">
          <div className="mb-6">
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              disabled={isPending}
              className="justify-center"
            />
          </div>

          <Button
            onClick={handleSubmit}
            loading={isPending}
            disabled={!otp || otp.length !== 6}
            className="gap-2.5 self-stretch p-2.5 mt-5 w-full font-semibold whitespace-nowrap rounded-md bg-slate-400 text-slate-200 hover:bg-slate-500 disabled:opacity-50"
          >
            {isPending ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="flex items-center justify-center mt-4 space-x-4">
            <button
              onClick={handleResendOTP}
              className="font-medium text-teal-600 hover:underline"
              disabled={isPending}
            >
              Resend OTP
            </button>
            <span className="text-gray-400">|</span>
            <Link href="/sign-in" className="font-medium text-teal-600">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}