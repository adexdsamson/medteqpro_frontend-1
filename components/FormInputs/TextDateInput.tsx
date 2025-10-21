/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ReactNode, useRef, useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar-rac";
import { DateInput } from "@/components/ui/datefield-rac";
import { Label } from "@/components/ui/label";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
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
import {
  parseDate,
  getLocalTimeZone,
  today,
  CalendarDate,
} from "@internationalized/date";

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

  // View mode: day/month/year
  const [viewMode, setViewMode] = useState<"day" | "month" | "year">("day");

  // Focused calendar value controls the visible month/year without committing selection
  const initialFocused = (
    value ? parseDate(value as string) : today(getLocalTimeZone())
  ) as CalendarDate;
  const [focusedValue, setFocusedValue] =
    useState<CalendarDate>(initialFocused);

  // Year grid window start for the year view
  const [yearGridStart, setYearGridStart] = useState<number>(
    initialFocused.year - 6
  );

  useEffect(() => {
    const nextFocused = (
      value ? parseDate(value as string) : today(getLocalTimeZone())
    ) as CalendarDate;
    setFocusedValue(nextFocused);
    // Keep the year grid window centered around current year
    setYearGridStart(nextFocused.year - 6);
  }, [value]);

  if (typeof (props as any).control !== "undefined") {
    delete (props as any).control;
  }

  const handleDateChange = (date: any) => {
    const dateString = date ? date.toString() : "";
    (onChange as any)?.(dateString);
  };

  const dateValue = value ? parseDate(value as string) : null;

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const headerLabel =
    viewMode === "year"
      ? `${yearGridStart}–${yearGridStart + 11}`
      : viewMode === "month"
      ? `${(focusedValue as CalendarDate).year}`
      : `${monthNames[(focusedValue as CalendarDate).month - 1]} ${(focusedValue as CalendarDate).year}`;

  const handlePrev = () => {
    if (viewMode === "day") {
      setFocusedValue(
        (prev) =>
          (prev as CalendarDate).add({
            months: -1,
          }) as CalendarDate
      );
    } else if (viewMode === "month") {
      setFocusedValue(
        (prev) =>
          (prev as CalendarDate).add({
            years: -1,
          }) as CalendarDate
      );
    } else {
      setYearGridStart((s) => s - 12);
    }
  };

  const handleNext = () => {
    if (viewMode === "day") {
      setFocusedValue(
        (prev) =>
          (prev as CalendarDate).add({
            months: 1,
          }) as CalendarDate
      );
    } else if (viewMode === "month") {
      setFocusedValue(
        (prev) =>
          (prev as CalendarDate).add({
            years: 1,
          }) as CalendarDate
      );
    } else {
      setYearGridStart((s) => s + 12);
    }
  };

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
            <Dialog className="max-h-[inherit] overflow-auto p-2">
              {/* Unified header for day/month/year */}
              <div className="flex items-center justify-between gap-2 px-1 pb-1">
                <div className="flex items-center gap-1">
                  <Button
                    aria-label={viewMode === "day" ? "Previous month" : viewMode === "month" ? "Previous year" : "Previous range"}
                    onPress={handlePrev}
                    className="text-muted-foreground/80 hover:bg-accent hover:text-foreground focus-visible:ring-ring/50 flex size-7 items-center justify-center rounded-md transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                  >
                    <ChevronLeftIcon size={12} />
                  </Button>
                  <div
                    onClick={() => {
                      const next = viewMode === "day" ? "month" : viewMode === "month" ? "year" : "day";
                      setViewMode(next);
                      if (next === "year") {
                        setYearGridStart((focusedValue as CalendarDate).year - 6);
                      }
                    }}
                    className="text-xs font-medium min-w-[2.5rem] text-center cursor-pointer"
                  >
                    {headerLabel}
                  </div>
                  <Button
                    aria-label={viewMode === "day" ? "Next month" : viewMode === "month" ? "Next year" : "Next range"}
                    onPress={handleNext}
                    className="text-muted-foreground/80 hover:bg-accent hover:text-foreground focus-visible:ring-ring/50 flex size-7 items-center justify-center rounded-md transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                  >
                    <ChevronRightIcon size={12} />
                  </Button>
                </div>
              </div>

              {viewMode === "day" ? (
                <Calendar
                  focusedValue={focusedValue as CalendarDate}
                  onFocusChange={(v) => setFocusedValue(v as CalendarDate)}
                />
              ) : viewMode === "month" ? (
                <div
                  role="grid"
                  aria-label="Choose month"
                  className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 p-1 transition-opacity duration-150"
                >
                  {[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].map((label, idx) => (
                    <Button
                      key={label}
                      aria-label={`Select ${label}`}
                      onPress={() => {
                        const current = focusedValue as CalendarDate;
                        const y = current.year;
                        const m = idx + 1;
                        const daysInMonth = new Date(y, m, 0).getDate();
                        const day = Math.min(current.day || 1, daysInMonth);
                        setFocusedValue(new CalendarDate(y, m, day));
                        setViewMode("day");
                      }}
                      className={`text-muted-foreground/80 hover:bg-accent hover:text-foreground focus-visible:ring-ring/50 flex h-8 items-center justify-center rounded-md text-xs outline-none focus-visible:ring-[3px] ${
                        (focusedValue as CalendarDate).month === idx + 1
                          ? "bg-accent text-foreground"
                          : ""
                      }`}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-1 p-1">
                  <div
                    role="grid"
                    aria-label="Choose year"
                    className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 transition-opacity duration-150"
                  >
                    {Array.from({ length: 12 }).map((_, i) => {
                      const y = yearGridStart + i;
                      const current = focusedValue as CalendarDate;
                      const m = current.month;
                      const daysInMonth = new Date(y, m, 0).getDate();
                      const day = Math.min(current.day || 1, daysInMonth);

                      return (
                        <Button
                          key={y}
                          aria-label={`Select year ${y}`}
                          onPress={() => {
                            setFocusedValue(new CalendarDate(y, m, day));
                            setViewMode("month");
                          }}
                          className={`text-muted-foreground/80 hover:bg-accent hover:text-foreground focus-visible:ring-ring/50 flex h-8 items-center justify-center rounded-md text-xs outline-none focus-visible:ring-[3px] ${
                            current.year === y
                              ? "bg-accent text-foreground"
                              : ""
                          }`}
                        >
                          {y}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
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
