"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";
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
import { ConfirmAlert } from "@/components/ConfirmAlert";
// import EditStaffDialog from "./EditStaffDialog"; // Assuming this will be created

export enum StaffStatus {
  Present = "Present",
  OnLeave = "On Leave",
  // Add other statuses as needed from the Figma design if any (e.g., Suspended, Terminated)
}

export type StaffType = {
  id: string;
  name: string;
  email: string; // Added email as it's common and shown in the example data
  position: string;
  contact: string;
  registrationDate: string;
  status: StaffStatus;
};

export const staffColumns: ColumnDef<StaffType>[] = [
  {
    accessorKey: "name",
    header: () => <div className="font-semibold text-gray-700">NAME</div>,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm text-gray-900">{row.original.name}</span>
        <span className="text-xs text-gray-500">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "position",
    header: () => <div className="font-semibold text-gray-700">POSITION</div>,
    cell: ({ row }) => <div className="text-sm text-gray-700">{row.original.position}</div>,
  },
  {
    accessorKey: "contact",
    header: () => <div className="font-semibold text-gray-700">CONTACT</div>,
    cell: ({ row }) => <div className="text-sm text-gray-700">{row.original.contact}</div>,
  },
  {
    accessorKey: "registrationDate",
    header: () => <div className="font-semibold text-gray-700">REGISTRATION DATE</div>,
    cell: ({ row }) => <div className="text-sm text-gray-700">{row.original.registrationDate}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="font-semibold text-gray-700">STATUS</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
      let badgeClass = "";

      if (status === StaffStatus.Present) {
        badgeVariant = "default"; // Using default for green-like present status
        badgeClass = "bg-green-100 text-green-700 border-green-300 hover:bg-green-200";
      } else if (status === StaffStatus.OnLeave) {
        badgeVariant = "outline"; // Using outline for blue-like on leave status
        badgeClass = "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200";
      }
      // Add more conditions for other statuses if needed

      return <Badge variant={badgeVariant} className={`capitalize ${badgeClass}`}>{status.toLowerCase()}</Badge>;
    },
  },
  {
    id: "actions",
    header: () => <div className="font-semibold text-gray-700 text-right">ACTION</div>,
    cell: ({ row }) => {
      const staff = row.original;
      return (
        <div className="text-right">
          {/* <DialogTrigger asChild> */}
          {/*   <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => console.log("Edit staff:", staff.id)}> */}
          {/*     <Edit2 className="h-4 w-4 text-blue-600" /> */}
          {/*   </Button> */}
          {/* </DialogTrigger> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(staff.id)}>
                Copy Staff ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DialogTrigger asChild> */}
                <DropdownMenuItem>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Staff
                </DropdownMenuItem>
              {/* </DialogTrigger> */}
              <ConfirmAlert
                title={`Delete ${staff.name}`}
                text={`Are you sure you want to delete ${staff.name}? This action cannot be undone.`}
                icon={Trash2}
                // onConfirm={() => console.log("Delete staff:", staff.id)} // Replace with actual delete function
              >
                <DropdownMenuItem className="text-red-600 hover:!text-red-600 hover:!bg-red-50">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Staff
                </DropdownMenuItem>
              </ConfirmAlert>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <EditStaffDialog staffMember={staff} /> */}
        </div>
      );
    },
  },
];