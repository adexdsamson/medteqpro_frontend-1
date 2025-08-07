import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForge, Forge, Forger } from "@/lib/forge";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextArea } from "@/components/FormInputs/TextArea";
import { TextDateInput } from "@/components/FormInputs/TextDateInput";
import { useAssignBed } from "@/features/services/bedManagementService";
import { useToastHandler } from "@/hooks/useToaster";
import { Loader2 } from "lucide-react";

const assignBedSchema = yup.object().shape({
  patientId: yup.string().required("Patient ID is required"),
  patientName: yup.string().required("Patient name is required"),
  admissionDate: yup.string().required("Admission date is required"),
  notes: yup.string().optional().default(""),
});

type AssignBedFormData = yup.InferType<typeof assignBedSchema>;

interface AssignBedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bedId: string;
  wardId: string;
  onSuccess?: () => void;
}

const AssignBedDialog: React.FC<AssignBedDialogProps> = ({
  open,
  onOpenChange,
  bedId,
  wardId,
  onSuccess,
}) => {
  const toast = useToastHandler();
  const assignBedMutation = useAssignBed(wardId, bedId);

  const { control } = useForge<AssignBedFormData>({
    defaultValues: {
      patientId: "",
      patientName: "",
      admissionDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
    resolver: yupResolver(assignBedSchema),
  });

  const onSubmit = async (data: AssignBedFormData) => {
    if (!bedId || !wardId) {
      toast.error("Error", "Invalid bed or ward information");
      return;
    }

    try {
      await assignBedMutation.mutateAsync({
        patient_id: data.patientId,
        expected_end_date: data.admissionDate,
      });

      toast.success("Success", "Bed assigned successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to assign bed. Please try again.";
      toast.error("Error", errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Bed to Patient</DialogTitle>
          <DialogDescription>
            Assign this bed to a patient by entering their details below.
          </DialogDescription>
        </DialogHeader>

        <Forge control={control} onSubmit={onSubmit}>
          <div className="space-y-4">
            <Forger
              name="patientId"
              component={TextInput}
              label="Patient ID *"
              placeholder="Enter patient ID"
            />

            <Forger
              name="patientName"
              component={TextInput}
              label="Patient Name *"
              placeholder="Enter patient name"
            />

            <Forger
              name="admissionDate"
              component={TextDateInput}
              label="Admission Date *"
            />

            <Forger
              name="notes"
              component={TextArea}
              label="Notes (Optional)"
              placeholder="Enter any additional notes"
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={assignBedMutation.isPending}
              >
                {assignBedMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  "Assign Bed"
                )}
              </Button>
            </DialogFooter>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
};

export default AssignBedDialog;