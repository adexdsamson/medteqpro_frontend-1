"use client";

import React, { useState } from "react";
import { useGetScheduledLabTests } from "@/features/services/labScientistService";
import { useToastHandler } from "@/hooks/useToaster";
import LaboratoryTable from "./_components/LaboratoryTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Subheader from "../../_components/Subheader";

export default function Laboratory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate] = useState<Date>();
  const toast = useToastHandler();
  
  const { data: labTestsData, isLoading } = useGetScheduledLabTests({
    search: searchTerm,
    start_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
  });

  const labTests = labTestsData?.data.data || [];

  // Transform lab test data to match the UI requirements
  const transformedData = labTests.map((test) => ({
    id: test.id,
    patientId: test.lab_no,
    patientName: test.patient_name,
    gender: "Female", // This would need to come from patient data
    testDateTime: `${format(new Date(test.test_date), "dd-MMM-yy HH:mm")}AM`,
    status: test.status,
    testType: test.test_type_name,
  }));

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddNewRecord = () => {
    // This would typically open a modal or navigate to a form
    toast.success("Info", "Add new record functionality to be implemented");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading laboratory data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <Subheader title="Laboratory" />

      {/* Main Content */}
      <div className="p-6">
        {/* Search and Controls */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Patient ID/Name"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64 pl-10 h-10"
              />
            </div>

            {/* Add New Record Button */}
            <Button 
              onClick={handleAddNewRecord}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-10 rounded-md flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Record
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Search Keyword</div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Select Option</span>
              <Tabs defaultValue="Results" className="items-center">
                <TabsList>
                  <TabsTrigger value="Results">Results</TabsTrigger>
                  <TabsTrigger value="Orders">Orders</TabsTrigger>
                  <TabsTrigger value="Test Types">Test Types</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Laboratory Table */}
        <div className="bg-white rounded-lg border">
          <LaboratoryTable 
            data={transformedData}
          />
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing 1-10 of 50 Items
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">10</span>
              <Button variant="outline" size="sm" className="h-8 px-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
              <span className="text-sm text-gray-500">per page</span>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled className="h-8 w-8 p-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <Button size="sm" className="bg-blue-600 text-white h-8 w-8 p-0">
                1
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                2
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                3
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                4
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                5
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}