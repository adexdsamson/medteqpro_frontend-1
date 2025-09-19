"use client";

import { DataTable } from "@/components/DataTable";
import { TextInput, TextInputProps } from "@/components/FormInputs/TextInput";
import {
  TextSelect,
  TextSelectProps,
} from "@/components/FormInputs/TextSelect";
import { Button } from "@/components/ui/button";
import { FieldProps, FormPropsRef, useForge, Forge } from "@/lib/forge";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, SearchIcon, Trash } from "lucide-react";
import React, { useRef, useState } from "react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmAlert } from "@/components/ConfirmAlert";
import { DialogTrigger } from "@/components/ui/dialog";
import Subheader from "../../../../layouts/Subheader";
import { useStaffList, StaffMember } from "@/features/services/staffService";
import AddUserDialog from "./_components/AddUserDialog";

// Transform API data to match table structure
type StaffTableData = {
  id: number;
  name: string;
  email: string;
  registeredDate: string;
  permission: string;
  status: string;
  phone_number: string | null;
};

const transformStaffData = (staffMembers: StaffMember[]): StaffTableData[] => {
  return staffMembers.map((member) => ({
    id: member.id,
    name: `${member.first_name} ${member.last_name}`,
    email: member.email,
    registeredDate: new Date().toISOString(), // API doesn't provide registration date
    permission: member.role.charAt(0).toUpperCase() + member.role.slice(1),
    status: member.is_active ? "Active" : "Suspended",
    phone_number: member.phone_number,
  }));
};

export default function StaffManagement() {
  const formRef = useRef<FormPropsRef | null>(null);
  const [searchParams, setSearchParams] = useState<{
    search?: string;
    role?: "superadmin" | "admin" | "support";
  }>({});

  const { data: staffResponse, isLoading, error } = useStaffList(searchParams);
  const staffData = staffResponse?.data?.data
    ? transformStaffData(staffResponse.data.data)
    : [];

  const renderInput: FieldProps<TextInputProps | TextSelectProps>[] = [
    {
      name: "search",
      label: "Search Name, Email",
      type: "text",
      placeholder: "Search name, email",
      containerClass: "flex-1",
      component: TextInput,
      startAdornment: <SearchIcon className="h-4 w-4" />,
    },
    {
      name: "permission",
      label: "Select Permission",
      placeholder: "User Permission",
      options: [
        { label: "All", value: "all" },
        { label: "Super Admin", value: "superadmin" },
        { label: "Admin", value: "admin" },
        { label: "Support", value: "support" },
      ],
      containerClass: "w-80",
      component: TextSelect,
    },
  ];

  const columns: ColumnDef<StaffTableData>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell({ row: { index } }) {
        return index + 1;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "registeredDate",
      header: "Date Registered",
      cell({ getValue }) {
        return format(getValue<string>(), "dd-MMM-yyyy");
      },
    },
    {
      accessorKey: "permission",
      header: "User Permissions",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell({ getValue }) {
        return <span>{getValue<string>()}</span>;
      },
    },
    {
      id: "action",
      header: "Action",
      cell({ row }) {
        return (
          <ConfirmAlert
            text={`You are about to delete this staff by the name of ${row.original.name}. Are you sure?`}
            title={`Delete ${row.original.name}`}
            icon={Trash}
          >
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Edit2 className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Suspend</DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="text-red-600">
                    Delete
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
          </ConfirmAlert>
        );
      },
    },
  ];

  // Define proper form data type
  type SearchFormData = {
    search: string;
    permission: string;
  };

  const { control } = useForge<SearchFormData>({
    defaultValues: {
      search: "",
      permission: "",
    },
    fields: renderInput,
  });

  const handleSubmit = async (data: SearchFormData) => {
    setSearchParams({
      search: data.search || undefined,
      role: (data.permission === 'superadmin' || data.permission === 'admin' || data.permission === 'support' ? data.permission : undefined),
    });
  };

  return (
    <>
      <Subheader title="User Management" />

      <div className="px-6 mt-6 space-y-5">
        <div className="flex items-center justify-between border-b py-2">
          <p>User List</p>
          <AddUserDialog>
            <Button>Add New User</Button>
          </AddUserDialog>
        </div>

        <div className="bg-white p-2 w-full flex items-center gap-3">
          <Forge
            control={control}
            ref={formRef}
            className="flex items-center w-full gap-3"
            onSubmit={handleSubmit}
          />
          <Button onClick={() => formRef.current?.onSubmit()}>Search</Button>
        </div>

        <div className="bg-white p-1.5 rounded-lg">
          {error ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-red-600">Error loading staff data</p>
            </div>
          ) : (
            <DataTable
              {...{
                columns,
                data: staffData,
                options: {
                  isLoading,
                },
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
