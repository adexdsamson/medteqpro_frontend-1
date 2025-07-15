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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForge, Forge, Forger } from "@/lib/forge";
import { TextSelect } from "@/components/FormInputs/TextSelect";
import { usePatientList } from "@/features/services/patientService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type AddToQueueDialogProps = {
  onAddToQueue: (data: QueueFormData) => void;
};

const schema = yup.object().shape({
  patientId: yup.string().required("Patient is required"),
  patientName: yup.string().required("Patient name is required"),
  serialNumber: yup.string().required("Serial number is required"),
  roomAssigned: yup.string().required("Room is required"),
  estimatedTime: yup.string().required("Estimated time is required"),
});

export type QueueFormData = yup.InferType<typeof schema>;

export default function AddToQueueDialog({
  onAddToQueue,
}: AddToQueueDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { data: patients = [], isLoading } = usePatientList();

  const { control, reset, watch, setValue } = useForge<QueueFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      patientId: "",
      patientName: "",
      serialNumber: "",
      roomAssigned: "",
      estimatedTime: "40mins",
    },
  });

  const selectedPatientId = watch("patientId");

  // Auto-populate patient name when patient is selected
  React.useEffect(() => {
    if (selectedPatientId) {
      const selectedPatient = patients.find(p => p.id === selectedPatientId);
      if (selectedPatient) {
        setValue("patientName", selectedPatient.name);
      }
    } else {
      setValue("patientName", "");
    }
  }, [selectedPatientId, patients, setValue]);

  // Transform patients data for select options
  const patientOptions = patients.map(patient => ({
    label: `${patient.name} (${patient.patientId})`,
    value: patient.id,
  }));

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
              <Label htmlFor="patientId" className="text-right">
                Patient
              </Label>
              <div className="col-span-3">
                <Forger
                  name="patientId"
                  component={TextSelect}
                  options={patientOptions}
                  placeholder={isLoading ? "Loading patients..." : "Select a patient"}
                  containerClass=""
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patientName" className="text-right">
                Patient Name
              </Label>
              <Forger
                name="patientName"
                id="patientName"
                className="col-span-3"
                placeholder="Patient name (auto-filled)"
                component={Input}
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serialNumber" className="text-right">
                Serial Number
              </Label>
              <Forger
                name="serialNumber"
                id="serialNumber"
                className="col-span-3"
                placeholder="Enter serial number"
                component={Input}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomAssigned" className="text-right">
                Room
              </Label>
              <Forger
                name="roomAssigned"
                id="roomAssigned"
                className="col-span-3"
                placeholder="Enter room number"
                component={Input}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estimatedTime" className="text-right">
                Est. Time
              </Label>
              <Forger
                name="estimatedTime"
                id="estimatedTime"
                placeholder="Estimated time (e.g. 40mins)"
                className="col-span-3"
                component={Input}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add to Queue</Button>
          </DialogFooter>
        </Forge>
      </DialogContent>
    </Dialog>
  );
}
