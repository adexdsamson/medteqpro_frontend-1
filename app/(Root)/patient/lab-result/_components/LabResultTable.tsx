"use client";

import React, { useState, useEffect } from "react";
import { useGetPatientLabTests, formatLabDate } from "@/features/services/labResultService";
import { Skeleton } from "@/components/ui/skeleton";

interface DateFilter {
  startDate?: string;
  endDate?: string;
}

interface LabResultTableProps {
  dateFilter?: DateFilter;
}

const LabResultTable: React.FC<LabResultTableProps> = ({ dateFilter }) => {
  // In a real app, you would get the patient ID from context or props
  // For now, we'll use a placeholder patient ID
  const patientId = "current-patient-id";
  
  // State for filtering options
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    startDate: "",
    endDate: "",
    search: "",
  });
  
  // Update filter options when dateFilter changes
  useEffect(() => {
    if (dateFilter) {
      setFilterOptions(prev => ({
        ...prev,
        startDate: dateFilter.startDate || "",
        endDate: dateFilter.endDate || "",
      }));
    }
  }, [dateFilter]);

  // Fetch lab results using the service
  const { data, isLoading, isError, error } = useGetPatientLabTests(patientId, filterOptions);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error loading lab results: {error?.message || "Unknown error"}</p>
      </div>
    );
  }

  // If no data or empty results
  const labResults = data?.data?.data || [];
  if (labResults.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No lab results found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Patient ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Test Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Test Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Lab Scientist
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Test Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {labResults.map((result) => (
            <tr 
              key={result.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => window.open(`/patient/lab-result/${result.id}`, "_self")}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {result.lab_no}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {result.test_type_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {result.entry_category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {result.ordered_by_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatLabDate(result.test_date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LabResultTable;