/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ReactNode } from "react";

type TextAreaProps = React.InputHTMLAttributes<HTMLTextAreaElement> & {
  label?: any;
  containerClass?: string;
  error?: string;
  helperText?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  rows?: number;
};

export const TextArea = (props: TextAreaProps) => {
  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        props.containerClass ?? ""
      }`}
    >
      <Label className="text-sm sm:text-base whitespace-nowrap text-stone-900 mb-1 sm:mb-2">
        {props.label}
      </Label>
      <div className="flex items-start bg-white rounded-lg border border-solid border-stone-300 py-2 sm:py- mt-1 sm:mt-2 px-3 sm:px-4 gap-2 touch-manipulation min-h-[88px] sm:min-h-[96px]">
        <span>{props.startAdornment}</span>
        <Textarea
          {...props}
          className="w-full text-sm sm:text-base leading-5 border-0 text-stone-900 !focus-visible:ring-0 !ring-0 !focus:border-0 !focus:outline-none px-0 placeholder:text-xs sm:placeholder:text-sm placeholder:text-gray-300 flex-1 focus-visible:ring-offset-0 touch-manipulation resize-none"
        />
        <span>{props.endAdornment}</span>
      </div>
      {props.error ? (
        <span className="text-xs text-red-500 mt-1 sm:mt-2">{props.error}</span>
      ) : props.helperText ? (
        <span className="text-xs text-gray-500 mt-1 sm:mt-2">{props.helperText}</span>
      ) : null}
    </div>
  );
};
