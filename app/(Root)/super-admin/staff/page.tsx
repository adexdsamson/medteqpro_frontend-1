"use client";

import { DataTable } from "@/components/DataTable";
import { TextInput, TextInputProps } from "@/components/FormInputs/TextInput";
import {
  TextSelect,
  TextSelectProps,
} from "@/components/FormInputs/TextSelect";
import { Button } from "@/components/ui/button";
import { makeArrayDataWithLength } from "@/demo";
import { FieldProps, FormPropsRef, useForge } from "@/lib/forge";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, SearchIcon, Trash } from "lucide-react";
import React, { useRef } from "react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmAlert } from "@/components/ConfirmAlert";
import { DialogTrigger } from "@/components/ui/dialog";
import Subheader from "../../_components/Subheader";

enum Permission {
  Admin = "Admin",
  Support = "Support",
}

enum Status {
  Active = "Active",
  Suspended = "Suspended",
}

export type StaffType = {
  id: string;
  name: string;
  email: string;
  registeredDate: string;
  permission: Permission;
  status: Status;
};

const getSampleStaffData = makeArrayDataWithLength<StaffType>(
  (faker) => ({
    email: faker.internet.email(),
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    permission: faker.helpers.enumValue(Permission),
    registeredDate: faker.date.anytime().toString(),
    status: faker.helpers.enumValue(Status),
  }),
  5
);

export default function StaffManagement() {
  const formRef = useRef<FormPropsRef | null>(null);

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
        { label: "Admin", value: "admin" },
        { label: "Support", value: "support" },
      ],
      containerClass: "w-80",
      component: TextSelect,
    },
  ];

  const columns: ColumnDef<StaffType>[] = [
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
          <ConfirmAlert text={`You are about to delete this staff by the name of ${row.original.name}. Are you sure?`} title={`Delete ${row.original.name}`} icon={Trash}>
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

  const { ForgeForm } = useForge({
    fieldProps: renderInput,
  });

  const handleSubmit = async () => {};

  return (
    <>
      <Subheader title="User Management" />

      <div className="px-6 mt-6 space-y-5">
        <div className="flex items-center justify-between border-b py-2">
          <p>User List</p>
          <Button>Add New User</Button>
        </div>

        <div className="bg-white p-2 w-full flex items-center gap-3">
          <ForgeForm
            ref={formRef}
            className="flex items-center w-full gap-3"
            onSubmit={handleSubmit}
          />
          <Button onClick={() => formRef.current?.onSubmit()}>Search</Button>
        </div>

        <div className="bg-white p-1.5 rounded-lg">
          <DataTable {...{ columns, data: getSampleStaffData }} />
        </div>
      </div>
    </>
  );
}
