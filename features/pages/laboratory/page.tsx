"use client";

import React, { useState } from "react";
import { useGetScheduledLabTests, useGetCompletedLabTests, useGetLabTestTypes, type LabTest, type LabTestType } from "@/features/services/labScientistService";
// import { useToastHandler } from "@/hooks/useToaster";
// import LaboratoryTable from "./_components/LaboratoryTable"; // replaced by per-tab tables
import ResultsTable from "./_components/ResultsTable";
import OrdersTable from "./_components/OrdersTable";
import TestTypesTable from "./_components/TestTypesTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddTestTypeDialog from "./_components/AddTestTypeDialog";
import AddLabTestDialog from "./_components/AddLabTestDialog";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Subheader from "../../../layouts/Subheader";

/**
 * Laboratory page component for managing lab tests and results
 * Provides functionality for viewing, searching, and managing laboratory entries
 * @returns JSX element containing the complete laboratory interface
 */
export default function LaboratoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate] = useState<Date>();
  // const toast = useToastHandler();
  const [addTestTypeDialogOpen, setAddTestTypeDialogOpen] = useState(false);
  const [addLabTestDialogOpen, setAddLabTestDialogOpen] = useState(false);
  
  // Scheduled (Orders) query
  const { data: scheduledData, isLoading: isOrdersLoading } = useGetScheduledLabTests({
    search: searchTerm,
    start_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
  });

  // Completed (Results) query
  const { data: resultsData, isLoading: isResultsLoading } = useGetCompletedLabTests({
    search: searchTerm,
    start_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
  });

  // Test Types query
  const { data: testTypesData, isLoading: isTestTypesLoading } = useGetLabTestTypes({
    search: searchTerm,
  });

  // Scheduled tests mapping -> Orders table rows
  const scheduledTests: LabTest[] = scheduledData?.data?.data || [];
  const ordersRows = scheduledTests.map((test) => ({
    id: test.id,
    labNo: test.lab_no,
    patientName: test.patient_name,
    entryCategory: test.entry_category,
    testType: test.test_type_name,
    scheduledDate: test.test_date ? format(new Date(test.test_date), "dd-MMM-yy") : "",
    status: test.status,
  }));

  // Completed tests mapping -> Results table rows
  const completedTests: LabTest[] = resultsData?.data?.data || [];
  const resultsRows = completedTests.map((test) => ({
    id: test.id,
    labNo: test.lab_no,
    patientName: test.patient_name,
    testType: test.test_type_name,
    status: test.status,
    testDate: test.test_date ? format(new Date(test.test_date), "dd-MMM-yy") : "",
  }));

  // Test types mapping -> Test Types table rows
  const apiTestTypes: LabTestType[] = testTypesData?.data?.results || [];
  const testTypeRows = apiTestTypes.map((t) => ({
    id: t.id,
    name: t.test_name,
    category: t.test_type,
    isActive: !!t.is_active,
  }));

  /**
   * Handles search input changes
   * @param value - The search term entered by the user
   */
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  /**
   * Handles opening the Add Test Type dialog
   */
  const handleAddTestType = () => {
    setAddTestTypeDialogOpen(true);
  };

  /**
   * Handles opening the Add Lab Test dialog
   */
  const handleAddLabTest = () => {
    setAddLabTestDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <Subheader title="Laboratory" />

      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="Results" className="w-full">
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

              {/* Add New Record Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-10 rounded-md flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Record
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleAddTestType}>
                    Add Test Type
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAddLabTest}>
                    Add Lab Test
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Search Keyword</div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Select Option</span>
                <TabsList>
                  <TabsTrigger value="Results">Results</TabsTrigger>
                  <TabsTrigger value="Orders">Orders</TabsTrigger>
                  <TabsTrigger value="Test Types">Test Types</TabsTrigger>
                </TabsList>
              </div>
            </div>
          </div>

          {/* Results Tab */}
          <TabsContent value="Results">
            <div className="bg-white rounded-lg border">
              <ResultsTable data={resultsRows} isLoading={isResultsLoading} />
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="Orders">
            <div className="bg-white rounded-lg border">
              <OrdersTable data={ordersRows} isLoading={isOrdersLoading} />
            </div>
          </TabsContent>

          {/* Test Types Tab */}
          <TabsContent value="Test Types">
            <div className="bg-white rounded-lg border">
              <TestTypesTable data={testTypeRows} isLoading={isTestTypesLoading} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog Components */}
      <AddTestTypeDialog
        open={addTestTypeDialogOpen}
        onOpenChange={setAddTestTypeDialogOpen}
        onSuccess={() => {
          // Optionally refresh data or show success message
        }}
      />

      <AddLabTestDialog
        open={addLabTestDialogOpen}
        onOpenChange={setAddLabTestDialogOpen}
        onSuccess={() => {
          // Optionally refresh data or show success message
        }}
      />
    </div>
  );
}