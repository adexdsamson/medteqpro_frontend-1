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
        className="*:not-first:mt-2"
        value={value}
        hourCycle={12}
        onChange={onChange}
        isDisabled={disabled}
      >
        <Label className="text-sm whitespace-nowrap text-stone-900 max-w-xs text-wrap break-words">
          {props.label}
        </Label>
        <DateInput 
          className="w-full text-sm leading-5 border border-stone-300 rounded-lg py-2 px-3 mt-2 bg-white text-stone-600 placeholder:text-xs placeholder:text-gray-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </TimeField>
      {props.error ? (
        <span className="text-xs text-red-500 mt-1">{props.error}</span>
      ) : props.helperText ? (
        <span className="text-xs text-gray-500 mt-1">{props.helperText}</span>
      ) : null}
    </div>
  );
};