'use client';

import React, { useState } from "react";
import LabResultTable from "./_components/LabResultTable";
import DateSelector from "./_components/DateSelector";

const LabResultPage = () => {
  // State for date filtering
  const [dateFilter, setDateFilter] = useState({
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
  });

  // Handler for date changes from DateSelector
  const handleDateChange = (startDate: string | undefined, endDate: string | undefined) => {
    setDateFilter({ startDate, endDate });
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Lab Result</h1>
        <DateSelector onDateChange={handleDateChange} />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-base font-medium mb-4">All Test Results</h2>
        <LabResultTable 
          dateFilter={dateFilter}
        />
      </div>
    </div>
  );
};

export default LabResultPage;