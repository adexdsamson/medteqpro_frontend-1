/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ReactNode } from "react";

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: any;
  containerClass?: string;
  error?: string;
  helperText?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
};

export type TextAreaProps = React.InputHTMLAttributes<HTMLTextAreaElement> & {
  label?: any;
  containerClass?: string;
  error?: string;
  helperText?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  rows?: number;
};

export const TextInput = ({
  containerClass,
  startAdornment,
  endAdornment,
  ...props
}: TextInputProps) => {
  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        containerClass ?? ""
      }`}
    >
      <Label className="text-sm whitespace-nowrap text-stone-900 max-w-xs text-wrap break-words">
        {props.label}
      </Label>
      <div className="flex items-center bg-white rounded-lg border border-solid border-stone-300 py-1 mt-2 px-3 gap-1">
        <span>{startAdornment}</span>
        <Input
          {...props}
          className="w-full text-sm leading-5 border-0 text-stone-400 !focus-visible:ring-0 !ring-0 !focus:border-0 !focus:outline-none px-0 placeholder:text-xs placeholder:text-gray-300 flex-1 focus-visible:ring-offset-0"
        />
        <span>{endAdornment}</span>
      </div>
      {props.error ? (
        <span className="text-xs text-red-500 mt-1">{props.error}</span>
      ) : props.helperText ? (
        <span className="text-xs text-gray-500 mt-1">{props.helperText}</span>
      ) : null}
    </div>
  );
};

export const TextArea = ({ containerClass, ...props }: TextAreaProps) => {
  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        containerClass ?? ""
      }`}
    >
      <Label className="flex flex-col justify-center text-sm whitespace-nowrap text-stone-900">
        {props.label}
      </Label>
      <div className="flex items-center bg-white rounded-lg border border-solid border-stone-300 py-1 mt-1 px-3 gap-1">
        <span>{props.startAdornment}</span>
        <Textarea
          {...props}
          className="w-full text-sm leading-5 border-0 text-stone-400 !focus-visible:ring-0 !ring-0 !focus:border-0 !focus:outline-none px-0 placeholder:text-xs placeholder:text-gray-300 flex-1 focus-visible:ring-offset-0"
        />
        <span>{props.endAdornment}</span>
      </div>
      {props.error ? (
        <span className="text-xs text-red-500 mt-1">{props.error}</span>
      ) : props.helperText ? (
        <span className="text-xs text-gray-500 mt-1">{props.helperText}</span>
      ) : null}
    </div>
  );
};
