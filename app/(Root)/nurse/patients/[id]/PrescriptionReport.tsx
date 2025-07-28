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
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash, MoreHorizontal, Plus } from "lucide-react";
import { format } from "date-fns";

import { useToastHandler } from "@/hooks/useToaster";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, patchRequest, deleteRequest } from "@/lib/axiosInstance";

// Types
type PrescriptionReport = {
  id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};



type PrescriptionFormData = {
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: number;
  notes?: string;
};

interface PrescriptionReportProps {
  patient: PatientDetailResponse | undefined;
}

// API functions
const fetchPrescriptionReports = async (patientId: string): Promise<PrescriptionReport[]> => {
  const response = await getRequest({
    url: `/patient-management/patients/${patientId}/prescription-reports/`
  });
  return response.data.data || [];
};

const createPrescriptionReport = async (patientId: string, data: PrescriptionFormData): Promise<PrescriptionReport> => {
  const response = await postRequest({
    url: `/patient-management/patients/${patientId}/prescription-reports/`,
    payload: data
  });
  return response.data.data;
};

const updatePrescriptionReport = async (patientId: string, reportId: string, data: PrescriptionFormData): Promise<PrescriptionReport> => {
  const response = await patchRequest({
    url: `/patient-management/patients/${patientId}/prescription-reports/${reportId}/`,
    payload: data
  });
  return response.data.data;
};

const deletePrescriptionReport = async (patientId: string, reportId: string): Promise<void> => {
  await deleteRequest({
    url: `/patient-management/patients/${patientId}/prescription-reports/${reportId}/`
  });
};

// Dialog Component
function PrescriptionDialog({ 
  patient, 
  editingPrescription, 
  open, 
  onOpenChange 
}: { 
  patient: PatientDetailResponse;
  editingPrescription?: PrescriptionReport;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const toast = useToastHandler();
  const queryClient = useQueryClient();
  const isEditing = !!editingPrescription;

  const { control, reset } = useForge<PrescriptionFormData>({

    defaultValues: {
      medicine_name: editingPrescription?.medicine_name || "",
      dosage: editingPrescription?.dosage || "",
      frequency: editingPrescription?.frequency || "",
      duration: editingPrescription?.duration || 1,
      notes: editingPrescription?.notes || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: PrescriptionFormData) => createPrescriptionReport(patient.id, data),
    onSuccess: () => {
      toast.success("Success", "Prescription created successfully");
      queryClient.invalidateQueries({ queryKey: ["prescription-reports", patient.id] });
      onOpenChange(false);
      reset();
    },
    onError: (error: Error) => {
      toast.error("Error", error.message || "Failed to create prescription");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: PrescriptionFormData) => updatePrescriptionReport(patient.id, editingPrescription!.id, data),
    onSuccess: () => {
      toast.success("Success", "Prescription updated successfully");
      queryClient.invalidateQueries({ queryKey: ["prescription-reports", patient.id] });
      onOpenChange(false);
      reset();
    },
    onError: (error: Error) => {
      toast.error("Error", error.message || "Failed to update prescription");
    },
  });

  const handleSubmit = (data: PrescriptionFormData) => {
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
            {isEditing ? "Edit Prescription" : "Add New Prescription"}
          </DialogTitle>
        </DialogHeader>
        
        <Forge control={control} onSubmit={handleSubmit} className="space-y-4">
          <Forger
            name="medicine_name"
            component={TextInput}
            label="Medicine Name"
            placeholder="e.g., Paracetamol 500mg"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Forger
              name="dosage"
              component={TextInput}
              label="Dosage"
              placeholder="e.g., 2 tablets"
            />
            
            <Forger
              name="frequency"
              component={TextInput}
              label="Frequency"
              placeholder="e.g., 2 times daily"
            />
          </div>
          
          <Forger
            name="duration"
            component={TextInput}
            label="Duration (days)"
            placeholder="7"
            type="number"
          />
          
          <Forger
            name="notes"
            component={TextArea}
            label="Notes (optional)"
            placeholder="Additional instructions..."
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

export default function PrescriptionReport({ patient }: PrescriptionReportProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<PrescriptionReport | undefined>();
  const toast = useToastHandler();
  const queryClient = useQueryClient();

  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ["prescription-reports", patient?.id],
    queryFn: () => fetchPrescriptionReports(patient!.id),
    enabled: !!patient?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (reportId: string) => deletePrescriptionReport(patient!.id, reportId),
    onSuccess: () => {
      toast.success("Success", "Prescription deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["prescription-reports", patient?.id] });
    },
    onError: (error: Error) => {
      toast.error("Error", error.message || "Failed to delete prescription");
    },
  });

  const columns: ColumnDef<PrescriptionReport>[] = [
    {
      accessorKey: "created_at",
      header: "Date & Time",
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return format(new Date(date), "dd-MMM-yyyy HH:mm");
      },
    },
    {
      accessorKey: "medicine_name",
      header: "Medicine",
    },
    {
      accessorKey: "dosage",
      header: "Dosage",
    },
    {
      accessorKey: "duration",
      header: "No of Days",
    },
    {
      accessorKey: "frequency",
      header: "Frequency",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const prescription = row.original;
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
                  setEditingPrescription(prescription);
                  setDialogOpen(true);
                }}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <ConfirmAlert
                title="Delete Prescription"
                text={`Are you sure you want to delete this prescription for ${prescription.medicine_name}? This action cannot be undone.`}
                icon={Trash}
                onClose={(open) => {
                  if (!open) {
                    deleteMutation.mutate(prescription.id);
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
        <h2 className="text-base font-medium">Prescription Report</h2>
        <Button
          onClick={() => {
            setEditingPrescription(undefined);
            setDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Prescription
        </Button>
      </div>
      
      <div className="bg-white rounded-lg">
        <DataTable
          columns={columns}
          data={prescriptions}
          options={{
            isLoading,
            disableSelection: true,
          }}
        />
      </div>

      <PrescriptionDialog
        patient={patient}
        editingPrescription={editingPrescription}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingPrescription(undefined);
          }
        }}
      />
    </div>
  );
}