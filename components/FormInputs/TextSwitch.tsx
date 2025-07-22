'use client'

import { Switch } from "@/components/ui/switch";
import { ReactNode } from "react";

export type TextSwitchProps = {
  label?: string;
  containerClass?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  dotColor?: string;
  helperText?: string;
  error?: string;
};

export const TextSwitch = ({ 
  containerClass, 
  label,
  checked, 
  onCheckedChange,
  startAdornment,
  endAdornment,
  dotColor = "bg-green-500",
  ...props 
}: TextSwitchProps) => {
  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        containerClass ?? ""
      }`}
    >
      <div className="flex items-center space-x-10 border rounded-md p-4 py-3 w-fit ">
        <div className="flex items-center space-x-2">
          {startAdornment && <span>{startAdornment}</span>}
          <div className={`h-2 w-2 rounded-full ${dotColor}`}></div>
          <span className="capitalize text-sm">{label}</span>
        </div>
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          {...props}
        />
        {endAdornment && <span>{endAdornment}</span>}
      </div>
      {props.error ? (
        <span className="text-xs text-red-500 mt-1">{props.error}</span>
      ) : props.helperText ? (
        <span className="text-xs text-gray-500 mt-1">{props.helperText}</span>
      ) : null}
    </div>
  );
};