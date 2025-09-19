import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForge, Forge, FormPropsRef } from "@/lib/forge";
import { TextInput } from "@/components/FormInputs/TextInput";
import { TextSelect } from "@/components/FormInputs/TextSelect";

/**
 * Queue Form Data Interface
 * Defines the structure of the form data for adding a patient to the queue
 */
export interface QueueFormData {
  patient: string;
  hospital_staff: string;
  purpose: string;
  priority: string;
  estimated_waiting_time: number;
}

/**
 * Add To Queue Dialog Props Interface
 */
type AddToQueueDialogProps = {
  onAddToQueue: (data: QueueFormData) => Promise<void>;
};

// Validation schema for the queue form
const queueFormSchema = yup.object().shape({
  patient: yup.string().required("Patient is required"),
  hospital_staff: yup.string().required("Staff member is required"),
  purpose: yup.string().required("Purpose is required"),
  priority: yup.string().required("Priority is required"),
  estimated_waiting_time: yup
    .number()
    .required("Estimated waiting time is required")
    .min(1, "Waiting time must be at least 1 minute")
    .max(480, "Waiting time cannot exceed 8 hours"),
});

type FormValues = yup.InferType<typeof queueFormSchema>;

/**
 * Add To Queue Dialog Component
 * 
 * A dialog component that allows users to add new patients to the queue.
 * Contains a form with fields for patient selection, staff assignment,
 * purpose, priority level, and estimated waiting time.
 * 
 * @param {AddToQueueDialogProps} props - The component props
 * @returns {JSX.Element} The add to queue dialog component
 */
export default function AddToQueueDialog({ onAddToQueue }: AddToQueueDialogProps) {
  const [open, setOpen] = React.useState(false);
  const formRef = useRef<FormPropsRef | null>(null);

  // Priority options
  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  // Purpose options
  const purposeOptions = [
    { value: "consultation", label: "Consultation" },
    { value: "follow_up", label: "Follow Up" },
    { value: "emergency", label: "Emergency" },
    { value: "routine_checkup", label: "Routine Checkup" },
    { value: "specialist_referral", label: "Specialist Referral" },
    { value: "diagnostic_test", label: "Diagnostic Test" },
    { value: "vaccination", label: "Vaccination" },
    { value: "other", label: "Other" },
  ];

  // Initialize form with validation
  const { control } = useForge<FormValues>({
    resolver: yupResolver(queueFormSchema),
    defaultValues: {
      patient: "",
      hospital_staff: "",
      purpose: "",
      priority: "",
      estimated_waiting_time: 15,
    },
    fields: [
      {
        name: "patient",
        component: TextInput,
        label: "Patient",
        placeholder: "Enter patient ID or name",
        required: true,
      },
      {
        name: "hospital_staff",
        component: TextInput,
        label: "Staff Member",
        placeholder: "Enter staff ID or name",
        required: true,
      },
      {
        name: "purpose",
        component: TextSelect,
        label: "Purpose",
        placeholder: "Select purpose of visit",
        options: purposeOptions,
        required: true,
      },
      {
        name: "priority",
        component: TextSelect,
        label: "Priority",
        placeholder: "Select priority level",
        options: priorityOptions,
        required: true,
      },
      {
        name: "estimated_waiting_time",
        component: TextInput,
        label: "Estimated Waiting Time (minutes)",
        placeholder: "Enter estimated waiting time",
        type: "number",
        required: true,
      },
    ],
  });

  /**
   * Handle form submission
   * @param {FormValues} data - The form data
   */
  const handleSubmit = async (data: FormValues) => {
    try {
      await onAddToQueue(data);
      setOpen(false);
      // Form will be reset when dialog closes
    } catch (error) {
      console.error("Error adding to queue:", error);
      // Error handling is done in the parent component
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add to Queue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Patient to Queue</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Forge
            {...{ control, onSubmit: handleSubmit, ref: formRef }}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-blue-700 hover:bg-blue-800"
              onClick={() => formRef.current?.onSubmit()}
            >
              Add to Queue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}