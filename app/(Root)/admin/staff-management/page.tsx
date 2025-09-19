"use client";

import React, { useRef, useMemo, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { TextInput, TextInputProps } from "@/components/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { FieldProps, Forge, FormPropsRef, useForge } from "@/lib/forge";
import { SearchIcon, Loader2 } from "lucide-react";
import Subheader from "../../../../layouts/Subheader";
import AddStaffDialog from "./_components/AddStaffDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { staffColumns } from "./_components/columns";
import { useHospitalStaffList } from "@/features/services/staffService";

export default function StaffManagementPage() {
  const formRef = useRef<FormPropsRef | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: staffData, isLoading, error } = useHospitalStaffList({
    search: searchQuery || undefined,
  });

  const searchField: FieldProps<TextInputProps>[] = [
    {
      name: "search",
      label: "", // No label in design, placeholder is used
      type: "text",
      placeholder: "Search Name",
      containerClass: "w-full sm:w-60",
      component: TextInput,
      showLabel: false,
      startAdornment: <SearchIcon className="h-4 w-4 text-gray-400" />,
      inputClassName: "pl-10 min-h-[44px] sm:min-h-[48px]", // Padding for the icon and responsive height
    },
  ];

  const { control } = useForge<{ search: string }>({
    fields: searchField,
    defaultValues: {
      search: "",
    },
  });

  const handleSubmit = async (data: { search: string }) => {
    setSearchQuery(data.search);
  };

  const filteredStaffData = useMemo(() => {
      if (!staffData?.data?.results) return [];
      // Add search filtering logic here if needed
      return staffData.data.results;
    }, [staffData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">
            Failed to load staff data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Dialog>
      <Subheader title="Staff Management" />
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="w-full sm:w-auto flex-1 sm:max-w-md">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Search Keyword
            </p>
            <Forge
              ref={formRef}
              control={control}
              className="flex items-center w-full gap-3"
              onSubmit={handleSubmit}
            />
          </div>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white min-h-[44px] sm:min-h-[48px] touch-manipulation">
              Add Staff
            </Button>
          </DialogTrigger>
        </div>

        <div className="bg-white p-1.5 rounded-lg shadow">
          <DataTable
            columns={staffColumns}
            data={filteredStaffData}
            options={{
              disableSelection: true,
              // Add other DataTable options as needed, e.g., pagination
            }}
          />
        </div>
      </div>
      <AddStaffDialog />
    </Dialog>
  );
}
