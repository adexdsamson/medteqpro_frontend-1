"use client";

import React from "react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ConfirmAlert } from "@/components/ConfirmAlert";
import { useToastHandler } from "@/hooks/useToaster";
import { useUpdateHospitalStatus } from "@/features/services/hospitalService";
import { useQueryClient } from "@tanstack/react-query";

type Hospital = {
  id: string;
  name: string;
  email: string;
  hospitalName: string;
  numberOfDoctors: string;
  dateRegistered: string;
  location: string;
  status: string;
};

interface RecentlyRegisteredTableProps {
  hospitals?: Hospital[];
  isLoading?: boolean;
}

export function RecentlyRegisteredTable({
  hospitals = [],
  isLoading = false,
}: RecentlyRegisteredTableProps) {

  const toast = useToastHandler();
  const updateHospitalStatus = useUpdateHospitalStatus();
  const queryClient = useQueryClient();

  const handleActivate = async (hospital: Hospital) => {
    try {
      const res = await updateHospitalStatus.mutateAsync({
        hospitalId: String(hospital.id),
        status: "active",
      });
      if (res?.status === 200) {
        toast.success("Hospital Activation", `${hospital.hospitalName || hospital.name} is now active`);
        queryClient.invalidateQueries({ queryKey: ["superadmin-dashboard"] });
      } else {
        toast.error("Hospital Activation", "Failed to activate hospital");
      }
    } catch (error) {
      toast.error("Hospital Activation", String(error));
    }
  };

  const handleSuspend = async (hospital: Hospital) => {
    try {
      const res = await updateHospitalStatus.mutateAsync({
        hospitalId: String(hospital.id),
        status: "suspended",
      });
      if (res?.status === 200) {
        toast.success("Hospital Suspension", `${hospital.hospitalName || hospital.name} has been suspended`);
        queryClient.invalidateQueries({ queryKey: ["superadmin-dashboard"] });
      } else {
        toast.error("Hospital Suspension", "Failed to suspend hospital");
      }
    } catch (error) {
      toast.error("Hospital Suspension", String(error));
    }
  };

  const columns: ColumnDef<Hospital>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const value = row.getValue("name") as string;
        return <span className="text-wrap">{value}</span>;
      }
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "hospitalName",
      header: "Hospital Name",
      cell: ({ row }) => {
        const value = row.getValue("name") as string;
        return <span className="text-wrap">{value}</span>;
      }
    },
    {
      accessorKey: "numberOfDoctors",
      header: "Number of Doctors",
    },
    {
      accessorKey: "dateRegistered",
      header: "Date Registered",
      cell: ({ row }) => {
        const value = row.getValue("dateRegistered") as string;
        return value ? format(value, "yyyy LLL dd") : "-";
      }
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              status === "active"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const hospital = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(hospital.status === "inactive" || hospital.status === "suspended") && (
                <ConfirmAlert
                  title="Activate Hospital"
                  text={`Are you sure you want to activate ${hospital.hospitalName || hospital.name}?`}
                  confirmText="Activate"
                  cancelText="Cancel"
                  trigger={
                    <span className={`p-2 text-xs block cursor-pointer ${updateHospitalStatus.isPending ? 'opacity-50 pointer-events-none' : ''}`}>
                      Activate
                    </span>
                  }
                  onConfirm={() => handleActivate(hospital)}
                />
              )}
              {hospital.status === "active" && (
                <ConfirmAlert
                  title="Suspend Hospital"
                  text={`Are you sure you want to suspend ${hospital.hospitalName || hospital.name}?`}
                  confirmText="Suspend"
                  cancelText="Cancel"
                  trigger={
                    <span className={`p-2 text-xs block cursor-pointer ${updateHospitalStatus.isPending ? 'opacity-50 pointer-events-none' : ''}`}>
                      Suspend
                    </span>
                  }
                  onConfirm={() => handleSuspend(hospital)}
                />
              )}
              <DropdownMenuItem
                className="text-xs text-center"
                onClick={() => {
                  // Handle view license action
                  console.log('View license for hospital:', hospital.id);
                }}
              >
                View License
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="bg-white px-2 overflow-auto max-w-[76vw]">
      <DataTable
        data={hospitals}
        columns={columns}
        options={{
          isLoading,
          disablePagination: true,
          disableSelection: true,
        }}
      />
    </div>
  );
}
