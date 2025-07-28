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
import { useBookAppointment, CreateAppointmentRequest } from "@/features/services/appointmentService";
import { usePatientsForAppointment } from "@/features/services/patientService";
import { useStaffForAppointment } from "@/features/services/staffService";
import { Time } from "@internationalized/date";
import { format } from "date-fns";
import { useToastHandler } from "@/hooks/useToaster";

// Validation schema
const schema = yup.object().shape({
  patient: yup.string().required("Patient is required"),
  staff: yup.string().required("Staff is required"),
  appointment_date: yup.string().required("Appointment date is required"),
  appointment_time: yup.mixed<Time>().required("Appointment time is required"),
  reason: yup.string().required("Reason is required"),
});

type FormValues = yup.InferType<typeof schema>;

interface BookAppointmentDialogProps {
  children: React.ReactNode;
}

export const BookAppointmentDialog: React.FC<BookAppointmentDialogProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  // Date state is now handled by Forge/Forger

  const toast = useToastHandler();
  
  const { mutateAsync: bookAppointment, isPending } = useBookAppointment();
  
  // Fetch patients and staff data from API - filter staff for nurses
  const { data: patientOptions = [], isLoading: isLoadingPatients } = usePatientsForAppointment();
  const { data: allStaffOptions = [], isLoading: isLoadingStaff } = useStaffForAppointment();
  
  // Filter staff options to show only nurses
  const staffOptions = allStaffOptions.filter(staff => 
    staff.label.toLowerCase().includes('nurse') || staff.value.includes('nurse')
  );

  const {
    control,
    handleSubmit,
    reset,
  } = useForge<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Convert Time object to string format for API using date-fns
      const timeString = data.appointment_time 
        ? format(new Date(0, 0, 0, data.appointment_time.hour, data.appointment_time.minute), 'HH:mm:ss')
        : '';
      
      const appointmentData: CreateAppointmentRequest = {
         patient: data.patient,
         staff: data.staff,
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
        staff: "",
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
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Book New Appointment</DialogTitle>
          <DialogDescription>
            Fill in the details below to book a new appointment for a patient.
          </DialogDescription>
        </DialogHeader>
        
        <Forge control={control} onSubmit={onSubmit}>
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
                name="staff" 
                component={TextSelect}
                label="Nurse"
                placeholder={"Select a nurse"}
                options={staffOptions}
                disabled={isLoadingStaff}
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
        </Forge>
        
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
            disabled={isPending || isLoadingPatients || isLoadingStaff}
          >
            {isPending ? "Booking..." : 
             isLoadingPatients || isLoadingStaff ? "Loading..." : 
             "Book Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};