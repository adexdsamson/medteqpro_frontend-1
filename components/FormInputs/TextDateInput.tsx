/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ReactNode } from "react";
import { Calendar } from "@/components/ui/calendar-rac";
import { DateInput } from "@/components/ui/datefield-rac";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import {
  Button,
  DatePicker,
  DatePickerProps,
  DateValue,
  Dialog,
  Group,
  Popover,
} from "react-aria-components";
import { parseDate } from "@internationalized/date";

export type TextDateInputProps<T extends DateValue> = Omit<DatePickerProps<T>, 'value' | 'onChange'> & {
  label?: any;
  containerClass?: string;
  error?: string;
  helperText?: string;
  startAdornment?: ReactNode;
  value?: string;
  onChange?: (date: string | null) => void;
};

export const TextDateInput = <T extends DateValue>({
  containerClass,
  value,
  onChange,
  ...props
}: TextDateInputProps<T>) => {
  // Convert string value to DateValue with error handling
  const dateValue = React.useMemo(() => {
    if (!value) return null;
    try {
      // Handle different date formats
      if (value.includes('T')) {
        // ISO format: 2025-07-17T00:00:00.000Z -> 2025-07-17
        return parseDate(value.split('T')[0]);
      }
      // Already in YYYY-MM-DD format
      return parseDate(value);
    } catch (error) {
      console.warn('Invalid date format:', value, error);
      return null;
    }
  }, [value]);
  
  // Handle onChange to convert DateValue back to string
  const handleChange = (date: DateValue | null) => {
    if (onChange) {
      // Convert DateValue to string format (YYYY-MM-DD) for form handling
      const stringValue = date ? date.toString() : null;
      onChange(stringValue);
    }
  };
  
  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        containerClass ?? ""
      }`}
    >
      <Label className="text-sm whitespace-nowrap text-stone-900 max-w-xs text-wrap break-words">
        {props.label}
      </Label>
      <DatePicker 
        className="mt-2" 
        value={dateValue as T}
        onChange={handleChange as any}
        {...props}
      >
        <div className="flex">
          <Group className="w-full ">
            <DateInput className="pe-9 py-6" />
          </Group>
          <Button className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]">
            <CalendarIcon size={16} />
          </Button>
        </div>
        <Popover
          className="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-lg border shadow-lg outline-hidden"
          offset={4}
        >
          <Dialog className="max-h-[inherit] overflow-auto p-2">
            <Calendar />
          </Dialog>
        </Popover>
      </DatePicker>
      {props.error ? (
        <span className="text-xs text-red-500 mt-1">{props.error}</span>
      ) : props.helperText ? (
        <span className="text-xs text-gray-500 mt-1">{props.helperText}</span>
      ) : null}
    </div>
  );
};
