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
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash, MoreHorizontal, Plus } from "lucide-react";
import { format } from "date-fns";

import { useToastHandler } from "@/hooks/useToaster";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, patchRequest, deleteRequest } from "@/lib/axiosInstance";

// Types
type VitalSigns = {
  id: string;
  body_temperature: number;
  pulse_rate: number;
  systolic_blood_pressure: number;
  diastolic_blood_pressure: number;
  oxygen_saturation: number;
  respiration_rate?: number;
  weight?: number;
  created_at: string;
  updated_at: string;
};

type VitalSignsFormData = {
  body_temperature: number;
  pulse_rate: number;
  systolic_blood_pressure: number;
  diastolic_blood_pressure: number;
  oxygen_saturation: number;
  respiration_rate?: number;
  weight?: number;
};

interface VitalSignsReportProps {
  patient: PatientDetailResponse | undefined;
}

// API functions
const fetchVitalSigns = async (patientId: string): Promise<VitalSigns[]> => {
  const response = await getRequest({
    url: `/patient-management/patients/${patientId}/vital-signs/`
  });
  return response.data.data || [];
};

const createVitalSigns = async (patientId: string, data: VitalSignsFormData): Promise<VitalSigns> => {
  const response = await postRequest({
    url: `/patient-management/patients/${patientId}/vital-signs/`,
    payload: data
  });
  return response.data.data;
};

const updateVitalSigns = async (patientId: string, vitalSignsId: string, data: VitalSignsFormData): Promise<VitalSigns> => {
  const response = await patchRequest({
    url: `/patient-management/patients/${patientId}/vital-signs/${vitalSignsId}/`,
    payload: data
  });
  return response.data.data;
};

const deleteVitalSigns = async (patientId: string, vitalSignsId: string): Promise<void> => {
  await deleteRequest({
    url: `/patient-management/patients/${patientId}/vital-signs/${vitalSignsId}/`
  });
};

// Dialog Component
function VitalSignsDialog({ 
  patient, 
  editingVitalSigns, 
  open, 
  onOpenChange 
}: { 
  patient: PatientDetailResponse;
  editingVitalSigns?: VitalSigns;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const toast = useToastHandler();
  const queryClient = useQueryClient();
  const isEditing = !!editingVitalSigns;

  const { control, reset } = useForge<VitalSignsFormData>({
    defaultValues: {
      body_temperature: editingVitalSigns?.body_temperature || 0,
      pulse_rate: editingVitalSigns?.pulse_rate || 0,
      systolic_blood_pressure: editingVitalSigns?.systolic_blood_pressure || 0,
      diastolic_blood_pressure: editingVitalSigns?.diastolic_blood_pressure || 0,
      oxygen_saturation: editingVitalSigns?.oxygen_saturation || 0,
      respiration_rate: editingVitalSigns?.respiration_rate || undefined,
      weight: editingVitalSigns?.weight || undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: VitalSignsFormData) => createVitalSigns(patient.id, data),
    onSuccess: () => {
      toast.success("Success", "Vital signs created successfully");
      queryClient.invalidateQueries({ queryKey: ["vital-signs", patient.id] });
      onOpenChange(false);
      reset();
    },
    onError: (error: Error) => {
      toast.error("Error", error.message || "Failed to create vital signs");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: VitalSignsFormData) => updateVitalSigns(patient.id, editingVitalSigns!.id, data),
    onSuccess: () => {
      toast.success("Success", "Vital signs updated successfully");
      queryClient.invalidateQueries({ queryKey: ["vital-signs", patient.id] });
      onOpenChange(false);
      reset();
    },
    onError: (error: Error) => {
      toast.error("Error", error.message || "Failed to update vital signs");
    },
  });

  const handleSubmit = (data: VitalSignsFormData) => {
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
            {isEditing ? "Edit Vital Signs" : "Add New Vital Signs"}
          </DialogTitle>
        </DialogHeader>
        
        <Forge control={control} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Forger
              name="body_temperature"
              component={TextInput}
              label="Body Temperature (°C)"
              placeholder="37.0"
              type="number"
              step="0.1"
            />
            
            <Forger
              name="pulse_rate"
              component={TextInput}
              label="Pulse Rate (BPM)"
              placeholder="72"
              type="number"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Forger
              name="systolic_blood_pressure"
              component={TextInput}
              label="Systolic BP (mmHg)"
              placeholder="120"
              type="number"
            />
            
            <Forger
              name="diastolic_blood_pressure"
              component={TextInput}
              label="Diastolic BP (mmHg)"
              placeholder="80"
              type="number"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Forger
              name="oxygen_saturation"
              component={TextInput}
              label="Oxygen Saturation (%)"
              placeholder="98"
              type="number"
            />
            
            <Forger
              name="respiration_rate"
              component={TextInput}
              label="Respiration Rate (optional)"
              placeholder="16"
              type="number"
            />
          </div>
          
          <Forger
            name="weight"
            component={TextInput}
            label="Weight (kg) (optional)"
            placeholder="70"
            type="number"
            step="0.1"
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

export default function VitalSignsReport({ patient }: VitalSignsReportProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVitalSigns, setEditingVitalSigns] = useState<VitalSigns | undefined>();
  const toast = useToastHandler();
  const queryClient = useQueryClient();

  const { data: vitalSigns = [], isLoading } = useQuery({
    queryKey: ["vital-signs", patient?.id],
    queryFn: () => fetchVitalSigns(patient!.id),
    enabled: !!patient?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (vitalSignsId: string) => deleteVitalSigns(patient!.id, vitalSignsId),
    onSuccess: () => {
      toast.success("Success", "Vital signs deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["vital-signs", patient?.id] });
    },
    onError: (error: Error) => {
      toast.error("Error", error.message || "Failed to delete vital signs");
    },
  });

  const columns: ColumnDef<VitalSigns>[] = [
    {
      accessorKey: "created_at",
      header: "Date & Time",
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return format(new Date(date), "dd-MMM-yyyy HH:mm");
      },
    },
    {
      accessorKey: "body_temperature",
      header: "Body Temp (°C)",
      cell: ({ getValue }) => {
        const temp = getValue<number>();
        return temp.toFixed(1);
      },
    },
    {
      accessorKey: "pulse_rate",
      header: "Pulse Rate (BPM)",
    },
    {
      id: "blood_pressure",
      header: "Blood Pressure (mmHg)",
      cell: ({ row }) => {
        const systolic = row.original.systolic_blood_pressure;
        const diastolic = row.original.diastolic_blood_pressure;
        return `${systolic}/${diastolic}`;
      },
    },
    {
      accessorKey: "oxygen_saturation",
      header: "Oxygen Saturation (%)",
      cell: ({ getValue }) => {
        const saturation = getValue<number>();
        return `${saturation}%`;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const vitalSign = row.original;
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
                  setEditingVitalSigns(vitalSign);
                  setDialogOpen(true);
                }}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <ConfirmAlert
                title="Delete Vital Signs"
                text={`Are you sure you want to delete this vital signs record? This action cannot be undone.`}
                icon={Trash}
                onClose={(open) => {
                  if (!open) {
                    deleteMutation.mutate(vitalSign.id);
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
        <h2 className="text-base font-medium">Vital Signs Report</h2>
        <Button
          onClick={() => {
            setEditingVitalSigns(undefined);
            setDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Vital Signs
        </Button>
      </div>
      
      <div className="bg-white rounded-lg">
        <DataTable
          columns={columns}
          data={vitalSigns}
          options={{
            isLoading,
            disableSelection: true,
          }}
        />
      </div>

      <VitalSignsDialog
        patient={patient}
        editingVitalSigns={editingVitalSigns}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingVitalSigns(undefined);
          }
        }}
      />
    </div>
  );
}