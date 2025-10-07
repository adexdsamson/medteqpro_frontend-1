/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ReactNode, useRef } from "react";
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
import { UNSAFE_PortalProvider } from "react-aria";
import { parseDate } from "@internationalized/date";

export type TextDateInputProps<T extends DateValue> = Omit<
  DatePickerProps<T>,
  "value" | "onChange"
> & {
  label?: any;
  containerClass?: string;
  error?: string;
  helperText?: string;
  startAdornment?: ReactNode;
  value?: string;
  onChange?: (date: string | null) => void;
  disabled?: boolean;
};

export const TextDateInput = <T extends DateValue>({
  containerClass,
  value,
  onChange,
  disabled,
  ...props
}: TextDateInputProps<T>) => {
  const portalRef = useRef<HTMLDivElement>(null);

  if (typeof (props as any).control !== "undefined") {
    delete (props as any).control;
  }

  const handleDateChange = (date: any) => {
    const dateString = date ? date.toString() : "";
    (onChange as any)?.(dateString);
  };

  const dateValue = value ? parseDate(value as string) : null;

  return (
    <div
      ref={portalRef}
      className={`flex flex-col font-medium w-full relative ${
        containerClass ?? ""
      }`}
    >
      <Label className="mb-1 sm:mb-2 block text-xs text-stone-900">
        {props.label}
      </Label>
      <UNSAFE_PortalProvider
        getContainer={() => portalRef.current ?? document.body}
      >
        <DatePicker
          {...(props as any)}
          isDisabled={disabled}
          value={dateValue}
          onChange={handleDateChange}
        >
          <div className="flex">
            <Group className="w-full">
              <DateInput className="pe-9 h-10" />
            </Group>
            <Button className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]">
              <CalendarIcon size={16} />
            </Button>
          </div>
          <Popover
            className="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-lg border shadow-lg outline-hidden"
            offset={4}
          >
            <Dialog className="max-h-[inherit] overflow-auto p-1">
              <Calendar />
            </Dialog>
          </Popover>
        </DatePicker>
      </UNSAFE_PortalProvider>
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
