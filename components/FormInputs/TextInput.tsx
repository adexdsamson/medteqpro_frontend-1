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
      <Label className="mb-1 sm:mb-2 block text-xs text-stone-900">
        {props.label}
      </Label>
      <div className="flex items-center bg-white rounded-lg border border-solid border-stone-300 gap-2 touch-manipulation">
        {startAdornment && <span className="px-2">{startAdornment}</span>}
        <Input
          {...props}
          className="w-full text-sm sm:text-base leading-5 border-0 text-stone-600 !focus-visible:ring-0 !ring-0 !focus:border-0 !focus:outline-none placeholder:text-xs sm:placeholder:text-sm placeholder:text-gray-300 flex-1 focus-visible:ring-offset-0 placeholder:ml-3 px-3"
        />
        <span>{endAdornment}</span>
      </div>
      {props.error ? (
        <span className="text-xs text-red-500 mt-1 sm:mt-2">
          {props.error}
        </span>
      ) : props.helperText ? (
        <span className="text-xs text-gray-500 mt-1 sm:mt-2">
          {props.helperText}
        </span>
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
      <Label className="flex flex-col justify-center text-sm sm:text-base whitespace-nowrap text-stone-900 mb-1 sm:mb-2">
        {props.label}
      </Label>
      <div className="flex items-start bg-white rounded-lg border border-solid border-stone-300 py-2 sm:py-3 mt-1 sm:mt-2 px-3 sm:px-4 gap-2 touch-manipulation min-h-[88px] sm:min-h-[96px]">
        <span>{props.startAdornment}</span>
        <Textarea
          {...props}
          className="w-full text-sm sm:text-base leading-5 border-0 text-stone-600 !focus-visible:ring-0 !ring-0 !focus:border-0 !focus:outline-none px-0 placeholder:text-xs sm:placeholder:text-sm placeholder:text-gray-300 flex-1 focus-visible:ring-offset-0 touch-manipulation resize-none"
        />
        <span>{props.endAdornment}</span>
      </div>
      {props.error ? (
        <span className="text-xs sm:text-sm text-red-500 mt-1 sm:mt-2">
          {props.error}
        </span>
      ) : props.helperText ? (
        <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
          {props.helperText}
        </span>
      ) : null}
    </div>
  );
};
