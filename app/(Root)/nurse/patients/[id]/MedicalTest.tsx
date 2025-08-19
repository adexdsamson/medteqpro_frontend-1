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
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash, MoreHorizontal, Plus } from "lucide-react";
import { format } from "date-fns";

import { useToastHandler } from "@/hooks/useToaster";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, patchRequest, deleteRequest } from "@/lib/axiosInstance";
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeClasses, formatStatusText } from "@/lib/statusColors";

// Types
type LabTest = {
  id: string;
  test_type: {
    id: string;
    name: string;
    description?: string;
  };
  specimen_type: string;
  specimen_collection_date?: string;
  scheduled_date: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  result?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

type LabTestType = {
  id: string;
  name: string;
  description?: string;
};



type LabTestFormData = {
  test_type_id: string;
  specimen_type: string;
  scheduled_date: string;
  specimen_collection_date?: string;
  notes?: string;
};

interface MedicalTestProps {
  patient: PatientDetailResponse | undefined;
}

// API functions
const fetchLabTests = async (patientId: string): Promise<LabTest[]> => {
  const response = await getRequest({
    url: `/laboratory-management/lab-tests/?patient=${patientId}`
  });
  return response.data.data || [];
};

const fetchLabTestTypes = async (): Promise<LabTestType[]> => {
  const response = await getRequest({
    url: `/laboratory-management/lab-test-types/`
  });
  return response.data.data || [];
};

const createLabTest = async (data: LabTestFormData & { patient: string }): Promise<LabTest> => {
  const response = await postRequest({
    url: `/laboratory-management/lab-tests/`,
    payload: data
  });
  return response.data.data;
};

const updateLabTest = async (testId: string, data: Partial<LabTestFormData>): Promise<LabTest> => {
  const response = await patchRequest({
    url: `/laboratory-management/lab-tests/${testId}/`,
    payload: data
  });
  return response.data.data;
};

const deleteLabTest = async (testId: string): Promise<void> => {
  await deleteRequest({
    url: `/laboratory-management/lab-tests/${testId}/`
  });
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  return (
    <Badge className={getStatusBadgeClasses(status)}>
      {formatStatusText(status)}
    </Badge>
  );
};

// Dialog Component
function LabTestDialog({ 
  patient, 
  editingLabTest, 
  open, 
  onOpenChange 
}: { 
  patient: PatientDetailResponse;
  editingLabTest?: LabTest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const toast = useToastHandler();
  const queryClient = useQueryClient();
  const isEditing = !!editingLabTest;

  const { data: labTestTypes = [] } = useQuery({
    queryKey: ["lab-test-types"],
    queryFn: fetchLabTestTypes,
  });

  const { control, reset } = useForge<LabTestFormData>({
    defaultValues: {
      test_type_id: editingLabTest?.test_type.id || "",
      specimen_type: editingLabTest?.specimen_type || "",
      scheduled_date: editingLabTest?.scheduled_date ? format(new Date(editingLabTest.scheduled_date), "yyyy-MM-dd") : "",
      specimen_collection_date: editingLabTest?.specimen_collection_date ? format(new Date(editingLabTest.specimen_collection_date), "yyyy-MM-dd") : "",
      notes: editingLabTest?.notes || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: LabTestFormData) => createLabTest({ ...data, patient: patient.id }),
    onSuccess: () => {
      toast.success("Success", "Lab test created successfully");
      queryClient.invalidateQueries({ queryKey: ["lab-tests", patient.id] });
      onOpenChange(false);
      reset();
    },
    onError: (error: Error) => {
      toast.error("Error", error.message || "Failed to create lab test");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: LabTestFormData) => updateLabTest(editingLabTest!.id, data),
    onSuccess: () => {
      toast.success("Success", "Lab test updated successfully");
      queryClient.invalidateQueries({ queryKey: ["lab-tests", patient.id] });
      onOpenChange(false);
      reset();
    },
    onError: (error: Error) => {
      toast.error("Error", error.message || "Failed to update lab test");
    },
  });

  const handleSubmit = (data: LabTestFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const testTypeOptions = labTestTypes.map(type => ({
    label: type.name,
    value: type.id,
  }));

  const specimenTypeOptions = [
    { label: "Blood", value: "blood" },
    { label: "Urine", value: "urine" },
    { label: "Stool", value: "stool" },
    { label: "Saliva", value: "saliva" },
    { label: "Tissue", value: "tissue" },
    { label: "Other", value: "other" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Lab Test" : "Add New Lab Test"}
          </DialogTitle>
        </DialogHeader>
        
        <Forge control={control} onSubmit={handleSubmit} className="space-y-4">
          <Forger
            name="test_type_id"
            component={TextSelect}
            label="Test Type"
            placeholder="Select test type"
            options={testTypeOptions}
          />
          
          <Forger
            name="specimen_type"
            component={TextSelect}
            label="Specimen Type"
            placeholder="Select specimen type"
            options={specimenTypeOptions}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Forger
              name="scheduled_date"
              component={TextInput}
              label="Scheduled Date"
              type="date"
            />
            
            <Forger
              name="specimen_collection_date"
              component={TextInput}
              label="Collection Date (optional)"
              type="date"
            />
          </div>
          
          <Forger
            name="notes"
            component={TextArea}
            label="Notes (optional)"
            placeholder="Additional notes..."
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

export default function MedicalTest({ patient }: MedicalTestProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLabTest, setEditingLabTest] = useState<LabTest | undefined>();
  const toast = useToastHandler();
  const queryClient = useQueryClient();

  const { data: labTests = [], isLoading } = useQuery({
    queryKey: ["lab-tests", patient?.id],
    queryFn: () => fetchLabTests(patient!.id),
    enabled: !!patient?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (testId: string) => deleteLabTest(testId),
    onSuccess: () => {
      toast.success("Success", "Lab test deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["lab-tests", patient?.id] });
    },
    onError: (error: Error) => {
      toast.error("Error", error.message || "Failed to delete lab test");
    },
  });

  const columns: ColumnDef<LabTest>[] = [
    {
      accessorKey: "test_type.name",
      header: "Test Name",
    },
    {
      accessorKey: "scheduled_date",
      header: "Scheduled Date",
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return format(new Date(date), "dd-MMM-yyyy");
      },
    },
    {
      accessorKey: "specimen_type",
      header: "Specimen Type",
      cell: ({ getValue }) => {
        const type = getValue<string>();
        return type.charAt(0).toUpperCase() + type.slice(1);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<string>();
        return <StatusBadge status={status} />;
      },
    },
    {
      accessorKey: "result",
      header: "Result",
      cell: ({ getValue }) => {
        const result = getValue<string>();
        return result || "Pending";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const labTest = row.original;
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
                  setEditingLabTest(labTest);
                  setDialogOpen(true);
                }}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <ConfirmAlert
                title="Delete Lab Test"
                text={`Are you sure you want to delete the ${labTest.test_type.name} test? This action cannot be undone.`}
                icon={Trash}
                onClose={(open) => {
                  if (!open) {
                    deleteMutation.mutate(labTest.id);
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
        <h2 className="text-base font-medium">Medical Test</h2>
        <Button
          onClick={() => {
            setEditingLabTest(undefined);
            setDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Lab Test
        </Button>
      </div>
      
      <div className="bg-white rounded-lg">
        <DataTable
          columns={columns}
          data={labTests}
          options={{
            isLoading,
            disableSelection: true,
          }}
        />
      </div>

      <LabTestDialog
        patient={patient}
        editingLabTest={editingLabTest}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingLabTest(undefined);
          }
        }}
      />
    </div>
  );
}