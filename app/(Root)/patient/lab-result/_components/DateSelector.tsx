"use client";

import React from "react";
import { FiCalendar } from "react-icons/fi";

const DateSelector = () => {
  return (
    <div className="flex items-center">
      <div className="relative">
        <span className="text-sm font-medium text-gray-600 mr-2">Select Date</span>
        <div className="flex items-center border rounded-md px-3 py-1.5 bg-white">
          <input
            type="text"
            className="text-sm outline-none"
            placeholder="Custom"
            readOnly
          />
          <FiCalendar className="h-4 w-4 text-blue-500 ml-2" />
        </div>
      </div>
    </div>
  );
};

export default DateSelector; 