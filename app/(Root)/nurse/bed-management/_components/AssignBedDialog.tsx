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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TextInput } from "@/components/FormInputs/TextInput";
import { useAssignBed } from "@/features/services/bedManagementService";
import { useToastHandler } from "@/hooks/useToaster";
import { Loader2 } from "lucide-react";

const assignBedSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  patientName: z.string().min(1, "Patient name is required"),
  admissionDate: z.string().min(1, "Admission date is required"),
  notes: z.string().optional(),
});

type AssignBedFormData = z.infer<typeof assignBedSchema>;

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
  const assignBedMutation = useAssignBed();

  const form = useForm<AssignBedFormData>({
    resolver: zodResolver(assignBedSchema),
    defaultValues: {
      patientId: "",
      patientName: "",
      admissionDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const onSubmit = async (data: AssignBedFormData) => {
    if (!bedId || !wardId) {
      toast.error("Error", "Invalid bed or ward information");
      return;
    }

    try {
      await assignBedMutation.mutateAsync({
        bedId,
        wardId,
        patientId: data.patientId,
        patientName: data.patientName,
        admissionDate: data.admissionDate,
        notes: data.notes,
      });

      toast.success("Success", "Bed assigned successfully");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient ID *</FormLabel>
                  <FormControl>
                    <TextInput
                      placeholder="Enter patient ID"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Name *</FormLabel>
                  <FormControl>
                    <TextInput
                      placeholder="Enter patient name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="admissionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admission Date *</FormLabel>
                  <FormControl>
                    <TextInput
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <TextInput
                      placeholder="Enter any additional notes"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignBedDialog;