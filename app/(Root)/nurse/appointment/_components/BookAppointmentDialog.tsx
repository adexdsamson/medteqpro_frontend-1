"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TextSelect } from "@/components/FormInputs/TextSelect";
import { TextDateInput } from "@/components/FormInputs/TextDateInput";
import { TextArea } from "@/components/FormInputs/TextArea";
import { TimeInput } from "@/components/FormInputs/TimeInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForge } from "@/lib/forge";
import { Forge, Forger } from "@/lib/forge";
import {
  useBookAppointment,
  CreateAppointmentRequest,
} from "@/features/services/appointmentService";
import { usePatientsForAppointment } from "@/features/services/patientService";
import { Time } from "@internationalized/date";
import { format } from "date-fns";
import { useToastHandler } from "@/hooks/useToaster";
import { storeFunctions } from "@/store/authSlice";

// Validation schema
const schema = yup.object().shape({
  patient: yup.string().required("Patient is required"),
  appointment_date: yup.string().required("Appointment date is required"),
  appointment_time: yup.mixed<Time>().required("Appointment time is required"),
  reason: yup.string().required("Reason is required"),
});

type FormValues = yup.InferType<typeof schema>;

interface BookAppointmentDialogProps {
  children: React.ReactNode;
}

export const BookAppointmentDialog: React.FC<BookAppointmentDialogProps> = ({
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  // Date state is now handled by Forge/Forger

  const toast = useToastHandler();

  const { mutateAsync: bookAppointment, isPending } = useBookAppointment();

  // Fetch patients data from API
  const { data: patientOptions = [], isLoading: isLoadingPatients } =
    usePatientsForAppointment();

  // Get current user from auth store
  const currentUser = storeFunctions.getState().user;

  const { control, handleSubmit, reset } = useForge<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (!currentUser?.id) {
        toast.error("Error", "User not authenticated. Please log in again.");
        return;
      }

      // Convert Time object to string format for API using date-fns
      const timeString = data.appointment_time
        ? format(
            new Date(
              0,
              0,
              0,
              data.appointment_time.hour,
              data.appointment_time.minute
            ),
            "HH:mm:ss"
          )
        : "";

      const appointmentData: CreateAppointmentRequest = {
        patient: data.patient,
        staff: currentUser.id,
        appointment_date: data.appointment_date,
        appointment_time: timeString,
        reason: data.reason,
      };

      await bookAppointment(appointmentData);
      toast.success("Success", "Appointment booked successfully!");
      setOpen(false);

      // Reset form
      reset({
        patient: "",
        appointment_date: "",
        appointment_time: undefined,
        reason: "",
      });
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Error", "Failed to book appointment. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Book New Appointment</DialogTitle>
          <DialogDescription>
            Fill in the details below to book a new appointment for a patient.
          </DialogDescription>
        </DialogHeader>

        <Forge control={control} onSubmit={onSubmit} >
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <Forger
                name="patient"
                component={TextSelect}
                label="Patient"
                placeholder={"Select a patient"}
                options={patientOptions}
                disabled={isLoadingPatients}
              />

              <Forger
                name="appointment_date"
                component={TextDateInput}
                label="Appointment Date"
                placeholder="Select appointment date"
              />

              <Forger
                name="appointment_time"
                component={TimeInput}
                label="Appointment Time"
                placeholder="Select appointment time"
              />

              <Forger
                name="reason"
                component={TextArea}
                label="Reason for Appointment"
                placeholder="Enter the reason for this appointment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isPending || isLoadingPatients}
            >
              {isPending
                ? "Booking..."
                : isLoadingPatients
                ? "Loading..."
                : "Book Appointment"}
            </Button>
          </DialogFooter>
        </Forge>
      </DialogContent>
    </Dialog>
  );
};
