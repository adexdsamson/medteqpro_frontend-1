/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar-rac";
import { DateInput } from "@/components/ui/datefield-rac";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { ReactNode } from "react";
import { DatePicker, DateValue, Group } from "react-aria-components";

export type TextDateInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  label?: any;
  containerClass?: string;
  error?: string;
  helperText?: string;
  startAdornment?: ReactNode;
  value?: DateValue | null;
  onChange?: (date: DateValue | null) => void;
};

export const TextDateInput = ({
  containerClass,
  startAdornment,
  value,
  onChange,
  ...props
}: TextDateInputProps) => {
  console.log({ value })
  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        containerClass ?? ""
      }`}
    >
      <Label className="text-sm whitespace-nowrap text-stone-900 max-w-xs text-wrap break-words">
        {props.label}
      </Label>
      <DatePicker value={value} onChange={onChange}>
        <div className="flex items-center bg-white rounded-lg border border-solid border-stone-300 py-1 mt-2 px-3 gap-1">
          <span>{startAdornment}</span>
          <Group className="w-full">
            <DateInput 
              className="w-full text-sm leading-5 border-0 text-stone-400 !focus-visible:ring-0 !ring-0 !focus:border-0 !focus:outline-none px-0 placeholder:text-xs placeholder:text-gray-300 flex-1 focus-visible:ring-offset-0"
              unstyled
            />
          </Group>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 p-0 text-stone-400 hover:text-stone-900 hover:bg-transparent"
              >
                <CalendarIcon />
                <span className="sr-only">Open calendar</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Dialog>
                <DialogContent className="max-h-[inherit] overflow-auto p-2 border-none shadow-none">
                  <Calendar />
                </DialogContent>
              </Dialog>
            </PopoverContent>
          </Popover>
        </div>
      </DatePicker>
      {props.error ? (
        <span className="text-xs text-red-500 mt-1">{props.error}</span>
      ) : props.helperText ? (
        <span className="text-xs text-gray-500 mt-1">{props.helperText}</span>
      ) : null}
    </div>
  );
};