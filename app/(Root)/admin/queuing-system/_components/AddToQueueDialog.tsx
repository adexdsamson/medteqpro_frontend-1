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

type AddToQueueDialogProps = {
  onAddToQueue: (data: QueueFormData) => void;
};

export type QueueFormData = {
  patientId: string;
  patientName: string;
  serialNumber: string;
  roomAssigned: string;
  estimatedTime: string;
};

export default function AddToQueueDialog({
  onAddToQueue,
}: AddToQueueDialogProps) {
  const [open, setOpen] = React.useState(false);

  const { control, reset } = useForge<QueueFormData>({
    defaultValues: {
      patientId: "",
      patientName: "",
      serialNumber: "",
      roomAssigned: "",
      estimatedTime: "40mins",
    },
  });

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
                Patient ID
              </Label>
              <Forger
                name="patientId"
                id="patientId"
                className="col-span-3"
                placeholder="Enter patient ID"
                component={Input}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patientName" className="text-right">
                Patient Name
              </Label>
              <Forger
                name="patientName"
                id="patientName"
                className="col-span-3"
                placeholder="Enter patient name"
                component={Input}
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
