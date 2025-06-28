/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForge } from '@/lib/forge';
import { Forge } from '@/lib/forge/Forge';
import { Forger } from '@/lib/forge/Forger';
import { Plus } from 'lucide-react';

export type QueueFormData = {
  serialNumber: string;
  gender: string;
  estimatedTime: string;
};

type AddToQueueDialogProps = {
  onAddToQueue: (data: QueueFormData) => Promise<void>;
};

export default function AddToQueueDialog({ onAddToQueue }: AddToQueueDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, reset } = useForge({
    defaultValues: {
      serialNumber: '',
      gender: '',
      estimatedTime: '40mins',
    },
  });

  const handleSubmit = async (data: QueueFormData) => {
    setIsSubmitting(true);
    try {
      await onAddToQueue(data);
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Error adding to queue:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add to Queue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Patient to Queue</DialogTitle>
        </DialogHeader>
        <Forge control={control} onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Forger
                name="serialNumber"
                component={(field: any) => (
                  <Input
                    {...field}
                    id="serialNumber"
                    placeholder="e.g., P001"
                    required
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Forger
                control={control}
                name="gender"
                component={( field: any ) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time</Label>
              <Forger
                control={control}
                name="estimatedTime"
                component={(field: any) => (
                  <Input
                    {...field}
                    id="estimatedTime"
                    placeholder="e.g., 40mins"
                    required
                  />
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Adding...' : 'Add to Queue'}
              </Button>
            </div>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
}