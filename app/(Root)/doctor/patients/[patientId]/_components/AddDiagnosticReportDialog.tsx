/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForge, Forge, Forger } from '@/lib/forge';
import { useToastHandler } from '@/hooks/useToaster';
import { useCreateDiagnosticReport } from '@/features/services/diagnosticReportService';
import { ApiResponseError } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TextInput } from '@/components/FormInputs/TextInput';
import { TextDateInput } from '@/components/FormInputs/TextDateInput';
import { TextArea } from '@/components/FormInputs/TextArea';
import { useUser } from '@/store/authSlice';

const schema = yup.object().shape({
  diagnosis: yup.string().required('Diagnosis is required'),
  follow_up_date: yup.string().required('Follow-up date is required'),
  notes: yup.string().notRequired(),
});

type FormValues = {
  diagnosis: string;
  follow_up_date: string;
  notes?: string;
};

interface AddDiagnosticReportDialogProps {
  patientId: string;
  onReportCreated?: () => void;
  children?: React.ReactNode;
}

/**
 * Dialog component for adding new diagnostic reports
 * @param patientId - The ID of the patient
 * @param onReportCreated - Callback function called after successful report creation
 */
export default function AddDiagnosticReportDialog({
  patientId,
  onReportCreated,
  children,
}: AddDiagnosticReportDialogProps) {
  const [open, setOpen] = useState(false);
  const toast = useToastHandler();
  const user = useUser();

  const { control, reset } = useForge<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      diagnosis: '',
      follow_up_date: '',
      notes: '',
    },
  });

  const { mutateAsync: createReport, isPending } = useCreateDiagnosticReport();

  /**
   * Handles form submission for creating a new diagnostic report
   * @param data - Form data containing diagnosis, follow-up date, and notes
   */
  const handleSubmit = async (data: FormValues) => {
    try {
      const payload = {
        diagnosis: data.diagnosis,
        follow_up_date: data.follow_up_date,
        recorded_by_name: user?.first_name + " " + user?.last_name,
        ...(data.notes && { notes: data.notes }),
      };

      await createReport({ patientId, payload });
      
      toast.success('Success', 'Diagnostic report created successfully');
      setOpen(false);
      reset();
      onReportCreated?.();
    } catch (error) {
      console.error('Error creating diagnostic report:', error);
      const err = error as ApiResponseError;
      toast.error('Error', err?.message ?? 'Failed to create diagnostic report');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button>Add Diagnosis</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Diagnostic Report</DialogTitle>
          <DialogDescription>
            Create a new diagnostic report for this patient. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        
        <Forge control={control} onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Forger
              name="diagnosis"
              component={TextInput}
              label="Diagnosis"
              placeholder="Enter diagnosis"
              required
            />
            
            <Forger
              name="follow_up_date"
              component={TextDateInput}
              label="Follow-up Date"
              placeholder="Select follow-up date"
              required
            />
            
            <Forger
              name="notes"
              component={TextArea}
              label="Notes"
              placeholder="Additional notes (optional)"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Report'}
            </Button>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
}