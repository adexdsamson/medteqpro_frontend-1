"use client";

import React from "react";
import { Label } from "react-aria-components";
import { TimeField, DateInput } from "@/components/ui/datefield-rac";
import { Time } from "@internationalized/date";

export type TimeInputProps = {
  name: string;
  label?: string;
  containerClass?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  onChange?: (value: Time | null) => void;
  value?: Time | null;
  disabled?: boolean;
};

export const TimeInput: React.FC<TimeInputProps> = ({
  containerClass,
  value,
  onChange,
  disabled,
  ...props
}) => {
  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        containerClass ?? ""
      }`}
    >
      <TimeField 
        className="*:not-first:mt-1 sm:*:not-first:mt-2"
        value={value}
        hourCycle={12}
        onChange={onChange}
        isDisabled={disabled}
      >
        <Label className="text-sm sm:text-base whitespace-nowrap text-stone-900 max-w-xs text-wrap break-words mb-1 sm:mb-2">
          {props.label}
        </Label>
        <DateInput 
          className="w-full text-sm sm:text-base leading-5 border border-stone-300 rounded-lg py-2 sm:py-3 px-3 sm:px-4 mt-1 sm:mt-2 bg-white text-stone-600 placeholder:text-xs sm:placeholder:text-sm placeholder:text-gray-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation min-h-[44px] sm:min-h-[48px]"
        />
      </TimeField>
      {props.error ? (
        <span className="text-xs sm:text-sm text-red-500 mt-1 sm:mt-2">{props.error}</span>
      ) : props.helperText ? (
        <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">{props.helperText}</span>
      ) : null}
    </div>
  );
};