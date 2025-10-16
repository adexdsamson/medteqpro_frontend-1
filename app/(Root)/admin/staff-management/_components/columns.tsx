"use client";

import { ColumnDef } from "@tanstack/react-table";
import { getStatusBadgeClasses, formatStatusText } from "@/lib/statusColors";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ConfirmAlert } from "@/components/ConfirmAlert";
// import EditStaffDialog from "./EditStaffDialog"; // Assuming this will be created

export enum StaffStatus {
  Active = "active",
  Inactive = "inactive",
  OnLeave = "on_leave",
  Suspended = "suspended",
}

// Updated to match API response structure
export type StaffType = {
  id: string;
  full_name: string;
  email: string;
  role: "doctor" | "nurse" | "front_desk" | "lab_scientist" | "pharmacist";
  specialization: string | null;
  phone_number: string | null;
  hospital: string;
  date_registered: string;
  status: "active" | "inactive" | "on_leave" | "suspended";
};

// Helper function to format role display
const formatRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    doctor: "Doctor",
    nurse: "Nurse",
    front_desk: "Front Desk",
    lab_scientist: "Lab Scientist",
    pharmacist: "Pharmacist",
  };
  return roleMap[role] || role;
};

// Helper function to format status display for staff (keeping "Present" for active)
const formatStaffStatus = (status: string): string => {
  if (status === "active") return "Present";
  return formatStatusText(status);
};

export const staffColumns: ColumnDef<StaffType>[] = [
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => {
      const staff = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{staff.full_name}</span>
          <span className="text-sm text-gray-500">{staff.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return formatRole(role);
    },
  },
  {
    accessorKey: "phone_number",
    header: "Contact",
    cell: ({ row }) => {
      const phone = row.getValue("phone_number") as string | null;
      return phone || "N/A";
    },
  },
  {
    accessorKey: "specialization",
    header: "Specialization",
    cell: ({ row }) => {
      const specialization = row.getValue("specialization") as string | null;
      return specialization || "N/A";
    },
  },
  {
    accessorKey: "date_registered",
    header: "Registration Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date_registered"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const displayStatus = formatStaffStatus(status);
      return (
        <Badge className={getStatusBadgeClasses(status)}>
          {displayStatus}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const staff = row.original;
      const ActionsMenu: React.FC = () => {
        const { push } = useRouter();
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => push(`/admin/staff-management/${staff.id}/permissions`)}
              >
                Permission
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => push(`/admin/staff-management/${staff.id}/work-status`)}
              >
                Work Status
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Placeholder items for future actions, e.g. Edit, Suspend */}
              {/* <DropdownMenuItem onClick={() => ...}>Edit Staff</DropdownMenuItem> */}
              <DropdownMenuItem>
               <ConfirmAlert
                  title="Delete Staff"
                  text="Are you sure you want to delete this staff member? This action cannot be undone."
                  onConfirm={() => {
                    // Handle delete action
                    console.log("Delete staff:", staff.id);
                  }}
                >
                  <span className="text-red-600 hover:text-red-700 w-full text-left cursor-pointer">
                    Delete staff
                  </span>
                </ConfirmAlert>
             </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      };

      return <ActionsMenu />;
    },
  },
];