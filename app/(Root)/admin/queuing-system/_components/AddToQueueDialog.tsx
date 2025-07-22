import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForge, Forge, Forger } from "@/lib/forge";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { usePatientList } from "@/features/services/patientService";
import { useHospitalStaffList } from "@/features/services/staffService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type AddToQueueDialogProps = {
  onAddToQueue: (data: QueueFormData) => void;
};

const schema = yup.object().shape({
  patient: yup.string().required("Patient is required"),
  hospital_staff: yup.string().required("Hospital staff is required"),
  purpose: yup.string().required("Purpose is required"),
  priority: yup.string().oneOf(["low", "medium", "high", "urgent"]).required("Priority is required"),
  estimated_waiting_time: yup.number().min(1, "Estimated time must be at least 1 minute").required("Estimated time is required"),
});

export type QueueFormData = yup.InferType<typeof schema>;

export default function AddToQueueDialog({
  onAddToQueue,
}: AddToQueueDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { data: patients = [], isLoading: patientsLoading } = usePatientList();
  const { data: staffData, isLoading: staffLoading } = useHospitalStaffList();

  const { control, reset } = useForge<QueueFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      patient: "",
      hospital_staff: "",
      purpose: "",
      priority: "medium",
      estimated_waiting_time: 30,
    },
  });

  // Transform patients data for select options
  const patientOptions = patients.map((patient) => ({
    label: `${patient.name} (${patient.patientId})`,
    value: patient.id,
  }));

  // Transform staff data for select options
  const staffOptions = (staffData?.data.results || []).map((staff) => ({
    label: `${staff.full_name} (${staff.role})`,
    value: staff.id,
  }));

  // Priority options
  const priorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Urgent", value: "urgent" },
  ];

  const handleSubmit = (data: QueueFormData) => {
    onAddToQueue(data);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-700 hover:bg-blue-800">Add to Queue</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Patient to Queue</DialogTitle>
          <DialogDescription>
            Enter patient details to add them to the queuing system.
          </DialogDescription>
        </DialogHeader>
        <Forge control={control} onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient" className="text-right">
                Patient
              </Label>
              <div className="col-span-3">
                <Forger
                  name="patient"
                  component={TextSelect}
                  options={patientOptions}
                  placeholder={
                    patientsLoading ? "Loading patients..." : "Select a patient"
                  }
                  containerClass=""
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hospital_staff" className="text-right">
                Hospital Staff
              </Label>
              <div className="col-span-3">
                <Forger
                  name="hospital_staff"
                  component={TextSelect}
                  options={staffOptions}
                  placeholder={
                    staffLoading ? "Loading staff..." : "Select hospital staff"
                  }
                  containerClass=""
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purpose" className="text-right">
                Purpose
              </Label>
              <Forger
                name="purpose"
                id="purpose"
                className="col-span-3"
                placeholder="Enter purpose of visit"
                component={Input}
              />
            </div>
            <div className="grid grid-cols-4 items-center  gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <div className="col-span-3">
                <Forger
                  name="priority"
                  component={TextSelect}
                  options={priorityOptions}
                  placeholder="Select priority"
                  containerClass=""
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estimated_waiting_time" className="text-right">
                Est. Time (mins)
              </Label>
              <Forger
                name="estimated_waiting_time"
                id="estimated_waiting_time"
                type="number"
                min="1"
                placeholder="Enter estimated time in minutes"
                className="col-span-3"
                component={Input}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Add to Queue</Button>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
}
