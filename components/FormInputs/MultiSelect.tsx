/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { RegisterOptions } from "react-hook-form";

export type MultiSelectProps = {
  name: string;
  label?: string | any;
  containerClass?: string;
  error?: string;
  helperText?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  onChange?: RegisterOptions["onChange"];
  value: string[];
  disabled?: boolean;
};

export const MultiSelect = ({ label, ...rest }: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const selectedValues = rest.value || [];

  const handleSelect = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((value) => value !== optionValue)
      : [...selectedValues, optionValue];
    
    rest?.onChange?.({
      target: { name: rest.name ?? "", value: newValues },
    });
  };

  const handleRemove = (optionValue: string) => {
    const newValues = selectedValues.filter((value) => value !== optionValue);
    rest?.onChange?.({
      target: { name: rest.name ?? "", value: newValues },
    });
  };



  return (
    <div className={rest?.containerClass ?? ""}>
      <Label
        htmlFor={typeof label === "string" ? label : ""}
        className="mb-2 block text-sm text-stone-900"
      >
        {label}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white text-xs text-stone-600 h-12"
            disabled={rest.disabled}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedValues.length === 0 ? (
                <span className="text-gray-300 text-xs">
                  {rest?.placeholder}
                </span>
              ) : (
                selectedValues.slice(0, 2).map((value) => {
                  const option = rest.options.find((opt) => opt.value === value);
                  return (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(value);
                      }}
                    >
                      {option?.label}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  );
                })
              )}
              {selectedValues.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{selectedValues.length - 2} more
                </Badge>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2">
          <div className="max-h-60 overflow-y-auto">
            {rest.options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer rounded"
                onClick={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    selectedValues.includes(option.value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                <span className="text-sm">{option.label}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {rest.error ? (
        <span className="text-xs text-red-500 mt-1">{rest.error}</span>
      ) : rest.helperText ? (
        <span className="text-xs text-gray-500 mt-1">{rest.helperText}</span>
      ) : null}
    </div>
  );
};