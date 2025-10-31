/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Subheader from "../../../../layouts/Subheader";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmAlert } from "@/components/ConfirmAlert";
import { Forge, useForge, FieldProps, Forger } from "@/lib/forge";
import { TextInput, TextInputProps } from "@/components/FormInputs/TextInput";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { TextArea } from "@/components/FormInputs/TextArea";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { SearchIcon, MoreHorizontal } from "lucide-react";
import { useToastHandler } from "@/hooks/useToaster";
import {
  ORARecordListItem,
  useGetORARecords,
  useDeleteORARecord,
  useCreateORARecord,
  CreateORARecordPayload,
} from "@/features/services/oraService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { usePatientsForAppointment } from "@/features/services/patientService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Columns for ORA records table
const columns: ColumnDef<ORARecordListItem>[] = [
  {
    accessorKey: "patient_fullname",
    header: "PATIENT NAME",
    cell: ({ row }) => <span className="font-medium">{row.getValue("patient_fullname") as string}</span>,
  },
  {
    accessorKey: "ora_type",
    header: "ORA TYPE",
    cell: ({ row }) => {
      const t = String(row.getValue("ora_type") || "");
      const label = t ? t[0].toUpperCase() + t.slice(1) : "";
      return <span className="capitalize font-medium">{label}</span>;
    },
  },
  {
    accessorKey: "date_registered",
    header: "DATE REGISTERED",
    cell: ({ row }) => {
      const date = String(row.getValue("date_registered") || "");
      if (!date) return <span>--</span>;
      const d = new Date(date);
      const formattedDate = d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTime = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return <span>{`${formattedDate} ${formattedTime}`}</span>;
    },
  },
  {
    id: "actions",
    header: "ACTION",
    cell: ({ row }) => <RowActions record={row.original} />,
  },
];

// Row actions component for per-record operations
const RowActions = ({ record }: { record: ORARecordListItem }) => {
  const toast = useToastHandler();
  const { mutateAsync: deleteRecord, isPending: isDeleting } = useDeleteORARecord();

  const handleDelete = async () => {
    try {
      await deleteRecord(record.id);
      toast.success("Deleted", "ORA record deleted successfully");
    } catch (error) {
      const err = error as { message?: string };
      toast.error("Error", err?.message || "Failed to delete ORA record");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ConfirmAlert
          title="Delete ORA Record"
          text="This action cannot be undone. Do you want to delete this ORA record?"
          trigger={<Button variant="ghost" disabled={isDeleting} className="text-red-600">Delete</Button>}
          onConfirm={handleDelete}
          confirmText="Yes, delete"
          cancelText="Cancel"
        />
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Dialog to create a new ORA record
const oraTypeOptions = [
  { value: "observed", label: "Observed" },
  { value: "admitted", label: "Admitted" },
  { value: "referred", label: "Referred" },
];

const createORASchema = yup.object({
  patient: yup.string().required("Patient is required"),
  ora_type: yup.string().required("ORA type is required"),
  reason: yup.string().required("Reason is required"),
  hours_observed: yup
    .number()
    .transform((v, orig) => (orig === "" || orig === null ? undefined : v))
    .nullable()
    .min(0, "Hours must be at least 0")
    .optional(),
  referrer_hospital: yup.string().nullable().optional(),
  referrer_department: yup.string().nullable().optional(),
});

function CreateORADialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toast = useToastHandler();
  const { data: patientOptions = [], isLoading: isLoadingPatients } = usePatientsForAppointment();
  const { mutateAsync: createRecord, isPending } = useCreateORARecord();

  const { control, reset } = useForge<CreateORARecordPayload>({
    resolver: yupResolver(createORASchema) as any,
    defaultValues: {
      patient: "",
      ora_type: "",
      reason: "",
      hours_observed: undefined,
      referrer_hospital: "",
      referrer_department: "",
    },
  });

  const handleSubmit = async (data: CreateORARecordPayload) => {
    try {
      // Normalize optional fields
      const payload: CreateORARecordPayload = {
        ...data,
        hours_observed:
          data.hours_observed === null || data.hours_observed === undefined
            ? undefined
            : Number(data.hours_observed),
        referrer_hospital: data.referrer_hospital || undefined,
        referrer_department: data.referrer_department || undefined,
      };

      await createRecord(payload);
      toast.success("Success", "ORA record created successfully");
      reset();
      setOpen(false);
    } catch (error) {
      const err = error as { message?: string };
      toast.error("Error", err?.message || "Failed to create ORA record");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white min-h-[44px] sm:min_h-[48px]">
            Add ORA Record
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create ORA Record</DialogTitle>
          <DialogDescription>
            Record an observation, admission, or referral for a patient.
          </DialogDescription>
        </DialogHeader>

        <Forge control={control} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Forger
              name="patient"
              component={TextSelect}
              label="Patient"
              placeholder={isLoadingPatients ? "Loading patients..." : "Select patient"}
              options={patientOptions}
            />
            <Forger
              name="ora_type"
              component={TextSelect}
              label="ORA Type"
              placeholder="Select type"
              options={oraTypeOptions}
            />
          </div>

          <Forger
            name="reason"
            component={TextArea}
            label="Reason"
            placeholder="Describe the reason"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Forger
              name="hours_observed"
              component={TextInput}
              label="Hours Observed"
              placeholder="e.g. 6"
              type="number"
              min="0"
            />
            <Forger
              name="referrer_hospital"
              component={TextInput}
              label="Referrer Hospital"
              placeholder="Optional"
            />
            <Forger
              name="referrer_department"
              component={TextInput}
              label="Referrer Department"
              placeholder="Optional"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isPending}>
              {isPending ? "Creating..." : "Create Record"}
            </Button>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
}

export default function DoctorORARecordsPage() {
  const [search, setSearch] = useState("");

  const fields: FieldProps<TextInputProps>[] = [
    {
      name: "search",
      label: "",
      type: "text",
      placeholder: "Search patient",
      containerClass: "w-full sm:w-60",
      component: TextInput,
      startAdornment: <SearchIcon className="h-4 w-4 text-gray-400" />,
    },
  ];

  const { control } = useForge<{ search: string }>({
    fields,
    defaultValues: { search: "" },
  });

  const handleSubmit = (data: { search: string }) => setSearch(data.search);

  // Server-side pagination state for DataTable
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Reset to first page when search changes
  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [search]);

  const page = useMemo(() => pagination.pageIndex + 1, [pagination.pageIndex]);
  const { data, isLoading } = useGetORARecords({
    page,
    page_size: pagination.pageSize,
    search: search || undefined,
  });

  const rows = useMemo(() => data?.results ?? [], [data]);
  const totalCounts = useMemo(() => data?.count ?? 0, [data]);

  return (
    <>
      <Subheader title="ORA Records" />
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="w-full sm:w-auto flex-1 sm:max-w-md">
            <p className="text-sm font-medium text-gray-600 mb-1">Search Keyword</p>
            <Forge control={control} className="flex items-center w-full gap-3" onSubmit={handleSubmit} />
          </div>

          <CreateORADialog>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white min-h-[44px] sm:min-h-[48px] touch-manipulation">
              Add ORA Record
            </Button>
          </CreateORADialog>
        </div>

        <div className="bg-white p-1.5 rounded-lg shadow overflow-auto max-w-[76vw]">
          <DataTable<ORARecordListItem>
            columns={columns}
            data={rows}
            options={{
              disableSelection: true,
              isLoading,
              pagination,
              setPagination,
              totalCounts,
              manualPagination: true,
            }}
          />
        </div>
      </div>
    </>
  );
}