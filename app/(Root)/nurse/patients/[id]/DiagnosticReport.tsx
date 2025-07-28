"use client";

import React, { useState } from "react";
import { PatientResponse as PatientDetailResponse } from "@/features/services/patientService";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmAlert } from "@/components/ConfirmAlert";
import { useForge, Forge, Forger } from "@/lib/forge";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextArea } from "@/components/FormInputs/TextArea";
import { TextDateInput } from "@/components/FormInputs/TextDateInput";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash, MoreHorizontal, Plus } from "lucide-react";
import { format } from "date-fns";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToastHandler } from "@/hooks/useToaster";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, patchRequest, deleteRequest } from "@/lib/axiosInstance";

// Types
type DiagnosisReport = {
  id: string;
  diagnosis: string;
  follow_up_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

type DiagnosisFormData = {
  diagnosis: string;
  follow_up_date: string;
  notes: string;
};

interface DiagnosticReportProps {
  patient: PatientDetailResponse | undefined;
}

// Validation schema
const diagnosisSchema = yup.object().shape({
  diagnosis: yup.string().required("Diagnosis is required"),
  follow_up_date: yup.string().required("Follow-up date is required"),
  notes: yup.string().required("Notes are required"),
});

// API functions
const fetchDiagnosisReports = async (patientId: string): Promise<DiagnosisReport[]> => {
  const response = await getRequest({
    url: `/patient-management/patients/${patientId}/diagnosis-reports/`
  });
  return response.data.data || [];
};

const createDiagnosisReport = async (patientId: string, data: DiagnosisFormData): Promise<DiagnosisReport> => {
  const response = await postRequest({
    url: `/patient-management/patients/${patientId}/diagnosis-reports/`,
    payload: data
  });
  return response.data.data;
};

const updateDiagnosisReport = async (patientId: string, reportId: string, data: DiagnosisFormData): Promise<DiagnosisReport> => {
  const response = await patchRequest({
    url: `/patient-management/patients/${patientId}/diagnosis-reports/${reportId}/`,
    payload: data
  });
  return response.data.data;
};

const deleteDiagnosisReport = async (patientId: string, reportId: string): Promise<void> => {
  await deleteRequest({
    url: `/patient-management/patients/${patientId}/diagnosis-reports/${reportId}/`
  });
};

// Dialog Component
function DiagnosisDialog({ 
  patient, 
  editingReport, 
  open, 
  onOpenChange 
}: { 
  patient: PatientDetailResponse;
  editingReport?: DiagnosisReport;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const toast = useToastHandler();
  const queryClient = useQueryClient();
  const isEditing = !!editingReport;

  const { control, reset } = useForge<DiagnosisFormData>({
    resolver: yupResolver(diagnosisSchema),
    defaultValues: {
      diagnosis: editingReport?.diagnosis || "",
      follow_up_date: editingReport?.follow_up_date || "",
      notes: editingReport?.notes || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: DiagnosisFormData) => createDiagnosisReport(patient.id, data),
    onSuccess: () => {
       toast.success("Success", "Diagnosis report created successfully");
       queryClient.invalidateQueries({ queryKey: ["diagnosis-reports", patient.id] });
       onOpenChange(false);
       reset();
     },
     onError: (error: Error) => {
       toast.error("Error", error.message || "Failed to create diagnosis report");
     },
  });

  const updateMutation = useMutation({
    mutationFn: (data: DiagnosisFormData) => updateDiagnosisReport(patient.id, editingReport!.id, data),
    onSuccess: () => {
       toast.success("Success", "Diagnosis report updated successfully");
       queryClient.invalidateQueries({ queryKey: ["diagnosis-reports", patient.id] });
       onOpenChange(false);
       reset();
     },
     onError: (error: Error) => {
       toast.error("Error", error.message || "Failed to update diagnosis report");
     },
  });

  const handleSubmit = (data: DiagnosisFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Diagnosis Report" : "Add New Diagnosis Report"}
          </DialogTitle>
        </DialogHeader>
        
        <Forge control={control} onSubmit={handleSubmit} className="space-y-4">
          <Forger
            name="diagnosis"
            component={TextInput}
            label="Diagnosis"
            placeholder="Enter diagnosis"
          />
          
          <Forger
            name="follow_up_date"
            component={TextDateInput}
            label="Follow-up Date"
            placeholder="Select follow-up date"
          />
          
          <Forger
            name="notes"
            component={TextArea}
            label="Notes"
            placeholder="Enter notes"
            rows={4}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
}

export default function DiagnosticReport({ patient }: DiagnosticReportProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<DiagnosisReport | undefined>();
  const toast = useToastHandler();
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["diagnosis-reports", patient?.id],
    queryFn: () => fetchDiagnosisReports(patient!.id),
    enabled: !!patient?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (reportId: string) => deleteDiagnosisReport(patient!.id, reportId),
    onSuccess: () => {
       toast.success("Success", "Diagnosis report deleted successfully");
       queryClient.invalidateQueries({ queryKey: ["diagnosis-reports", patient?.id] });
     },
     onError: (error: Error) => {
       toast.error("Error", error.message || "Failed to delete diagnosis report");
     },
  });

  const columns: ColumnDef<DiagnosisReport>[] = [
    {
      accessorKey: "created_at",
      header: "Date & Time",
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return format(new Date(date), "dd-MMM-yyyy HH:mm");
      },
    },
    {
      accessorKey: "diagnosis",
      header: "Diagnosis",
    },
    {
      accessorKey: "follow_up_date",
      header: "Follow-up Date",
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return format(new Date(date), "dd-MMM-yyyy");
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ getValue }) => {
        const notes = getValue<string>();
        return (
          <div className="max-w-xs truncate" title={notes}>
            {notes}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const report = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setEditingReport(report);
                  setDialogOpen(true);
                }}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <ConfirmAlert
                title="Delete Diagnosis Report"
                text={`Are you sure you want to delete this diagnosis report? This action cannot be undone.`}
                icon={Trash}
                onClose={(open) => {
                  if (!open) {
                    deleteMutation.mutate(report.id);
                  }
                }}
              >
                <DropdownMenuItem className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </ConfirmAlert>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (!patient) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium">Diagnostic Report</h2>
        <Button
          onClick={() => {
            setEditingReport(undefined);
            setDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Diagnosis
        </Button>
      </div>
      
      <div className="bg-white rounded-lg">
        <DataTable
          columns={columns}
          data={reports}
          options={{
            isLoading,
            disableSelection: true,
          }}
        />
      </div>

      <DiagnosisDialog
        patient={patient}
        editingReport={editingReport}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingReport(undefined);
          }
        }}
      />
    </div>
  );
}