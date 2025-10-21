"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/FormInputs/TextInput";
import { BedData } from "./columns";
import { useUpdateBed } from "@/features/services/bedManagementService";
import { useToastHandler } from "@/hooks/useToaster";

interface EditBedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wardId: string;
  bed: BedData | null;
  onUpdated?: () => Promise<void> | void;
}

const EditBedDialog: React.FC<EditBedDialogProps> = ({ open, onOpenChange, wardId, bed, onUpdated }) => {
  const [bedNumber, setBedNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const toast = useToastHandler();
  const updateBedMutation = useUpdateBed();

  useEffect(() => {
    if (bed) {
      setBedNumber(bed.bedId || "");
      setRoomNumber(bed.roomNo || "");
    }
  }, [bed]);

  const handleSave = async () => {
    if (!bed) return;
    try {
      await updateBedMutation.mutateAsync({
        wardId,
        bedId: bed.id,
        payload: {
          bed_number: bedNumber,
          room_number: roomNumber,
        },
      });
      toast.success("Success", "Bed updated successfully");
      onOpenChange(false);
      if (onUpdated) await onUpdated();
    } catch (err) {
      toast.error("Error", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Bed</DialogTitle>
          <DialogDescription>
            Update bed details and click save to apply changes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <TextInput
            label="Bed Number"
            placeholder="Enter bed number"
            value={bedNumber}
            onChange={(e) => setBedNumber(e.target.value)}
          />
          <TextInput
            label="Room Number"
            placeholder="Enter room number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateBedMutation.isPending}>
            {updateBedMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBedDialog;