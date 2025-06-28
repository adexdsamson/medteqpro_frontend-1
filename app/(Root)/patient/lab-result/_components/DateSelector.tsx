"use client";

import React, { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface DateSelectorProps {
  onDateChange?: (startDate: string | undefined, endDate: string | undefined) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ onDateChange }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsOpen(false);
    
    // Format date for API and call the callback
    if (selectedDate && onDateChange) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      onDateChange(formattedDate, formattedDate);
    } else if (onDateChange) {
      onDateChange(undefined, undefined);
    }
  };
  
  const handleClear = () => {
    setDate(undefined);
    if (onDateChange) {
      onDateChange(undefined, undefined);
    }
  };

  return (
    <div className="flex items-center">
      <div className="relative">
        <span className="text-sm font-medium text-gray-600 mr-2">Select Date</span>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center border rounded-md px-3 py-1.5 bg-white cursor-pointer">
              <input
                type="text"
                className="text-sm outline-none cursor-pointer"
                placeholder="Select date"
                value={date ? format(date, "dd MMM yyyy") : ""}
                readOnly
              />
              <FiCalendar className="h-4 w-4 text-blue-500 ml-2" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              initialFocus
            />
            {date && (
              <div className="p-2 border-t flex justify-end">
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateSelector;