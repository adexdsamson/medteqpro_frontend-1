"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  ({ length = 6, value = "", onChange, className, disabled = false, ...props }, ref) => {
    const [otp, setOtp] = React.useState<string[]>(new Array(length).fill(""));
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    React.useEffect(() => {
      if (value) {
        const otpArray = value.split("").slice(0, length);
        const paddedArray = [...otpArray, ...new Array(length - otpArray.length).fill("")];
        setOtp(paddedArray);
      }
    }, [value, length]);

    const handleChange = (element: HTMLInputElement, index: number) => {
      if (isNaN(Number(element.value))) return;

      const newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);

      const otpValue = newOtp.join("");
      onChange?.(otpValue);

      // Focus next input
      if (element.value && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData("text");
      const pasteArray = pasteData.split("").slice(0, length);
      
      if (pasteArray.every(char => !isNaN(Number(char)))) {
        const newOtp = [...pasteArray, ...new Array(length - pasteArray.length).fill("")];
        setOtp(newOtp);
        onChange?.(pasteArray.join(""));
        
        // Focus the last filled input or the next empty one
        const focusIndex = Math.min(pasteArray.length, length - 1);
        inputRefs.current[focusIndex]?.focus();
      }
    };

    return (
      <div
        ref={ref}
        className={cn("flex gap-2 justify-center", className)}
        {...props}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
                inputRefs.current[index] = el;
              }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              "w-12 h-12 text-center text-lg font-semibold border border-input rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-colors"
            )}
          />
        ))}
      </div>
    );
  }
);

OTPInput.displayName = "OTPInput";

export { OTPInput };