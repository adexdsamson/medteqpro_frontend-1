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
  useRescheduleAppointment, 
  RescheduleAppointmentRequest 
} from "@/features/services/appointmentService";
import { useStaffForAppointment } from "@/features/services/staffService";
import { Time } from "@internationalized/date";
import { format } from "date-fns";
import { useToastHandler } from "@/hooks/useToaster";
import { Appointment } from "./columns";

// Define FormValues type explicitly to ensure consistency
interface FormValues {
  new_appointment_date: string;
  new_appointment_time: Time;
  reason_for_reschedule: string;
  new_staff_id?: string;
}

// Validation schema
const schema: yup.ObjectSchema<FormValues> = yup.object().shape({
  new_appointment_date: yup.string().required("New appointment date is required"),
  new_appointment_time: yup.mixed<Time>().required("New appointment time is required"),
  reason_for_reschedule: yup.string().required("Reason for rescheduling is required"),
  new_staff_id: yup.string().optional(),
});

interface RescheduleAppointmentDialogProps {
  children: React.ReactNode;
  appointment: Appointment;
}

export const RescheduleAppointmentDialog: React.FC<RescheduleAppointmentDialogProps> = ({ 
  children, 
  appointment 
}) => {
  const [open, setOpen] = React.useState(false);
  const toast = useToastHandler();
  
  const { mutateAsync: rescheduleAppointment, isPending } = useRescheduleAppointment();
  
  // Fetch staff data from API
  const { data: staffOptions = [], isLoading: isLoadingStaff } = useStaffForAppointment();

  const {
    control,
    handleSubmit,
    reset,
  } = useForge<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      new_appointment_date: "",
      new_appointment_time: undefined,
      reason_for_reschedule: "",
      new_staff_id: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Convert Time object to string format for API using date-fns
      const timeString = data.new_appointment_time 
        ? format(new Date(0, 0, 0, data.new_appointment_time.hour, data.new_appointment_time.minute), 'HH:mm:ss')
        : '';
      
      const rescheduleData: RescheduleAppointmentRequest = {
        new_appointment_date: data.new_appointment_date,
        new_appointment_time: timeString,
        reason_for_reschedule: data.reason_for_reschedule,
        ...(data.new_staff_id && { new_staff_id: data.new_staff_id }),
      };

      await rescheduleAppointment({ id: appointment.id, data: rescheduleData });
      toast.success("Success", "Appointment rescheduled successfully!");
      setOpen(false);
      
      // Reset form
      reset({
        new_appointment_date: "",
        new_appointment_time: undefined,
        reason_for_reschedule: "",
        new_staff_id: undefined,
      });
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      toast.error("Error", "Failed to reschedule appointment. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>
            Reschedule the appointment for {appointment.patientName}. Please provide the new date, time, and reason for rescheduling.
          </DialogDescription>
        </DialogHeader>
        
        {/* Current Appointment Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Current Appointment Details</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">Patient:</span> {appointment.patientName}</p>
            <p><span className="font-medium">Current Date & Time:</span> {appointment.appointmentDateTime}</p>
            <p><span className="font-medium">Status:</span> {appointment.status}</p>
          </div>
        </div>
        
        <Forge control={control} onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <Forger 
                name="new_appointment_date" 
                component={TextDateInput}
                label="New Appointment Date"
                placeholder="Select new appointment date"
              />

              <Forger 
                name="new_appointment_time" 
                component={TimeInput}
                label="New Appointment Time"
                placeholder="Select new appointment time"
              />

              <Forger 
                name="new_staff_id" 
                component={TextSelect}
                label="Staff Member (Optional)"
                placeholder="Select a different staff member (optional)"
                options={staffOptions}
                disabled={isLoadingStaff}
              />
              
              <Forger 
                name="reason_for_reschedule" 
                component={TextArea}
                label="Reason for Rescheduling"
                placeholder="Please provide the reason for rescheduling this appointment"
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
            disabled={isPending || isLoadingStaff}
          >
            {isPending ? "Rescheduling..." : 
             isLoadingStaff ? "Loading..." : 
             "Reschedule Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};