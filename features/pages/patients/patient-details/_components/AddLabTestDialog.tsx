/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForge, Forge, Forger } from '@/lib/forge';
import { useToastHandler } from '@/hooks/useToaster';
import { useCreateLabTest, CreateLabTestPayload } from '@/features/services/labResultService';
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
import { TextDateInput } from '@/components/FormInputs/TextDateInput';
import { TextSelect } from '@/components/FormInputs/TextSelect';
import { TextArea } from '@/components/FormInputs/TextArea';
import { Plus } from 'lucide-react';
import { useUser } from '@/store/authSlice';
import { generateId } from '@/lib/forge/utils';

const schema = yup.object().shape({
  test_type: yup.string().required('Test type is required'),
  specimen: yup.string().required('Specimen is required'),
  entry_category: yup.string().required('Entry category is required'),
  date_collected: yup.string().required('Collection date is required'),
  notes: yup.string().notRequired(),
});

type FormValues = {
  test_type: string;
  specimen: string;
  entry_category: string;
  date_collected: string;
  notes?: string;
};

interface AddLabTestDialogProps {
  patientId: string;
  onTestCreated?: () => void;
}

/**
 * Dialog component for adding new lab test records
 * @param patientId - The ID of the patient
 * @param onTestCreated - Callback function called after successful test creation
 */
export default function AddLabTestDialog({
  patientId,
  onTestCreated,
}: AddLabTestDialogProps) {
  const [open, setOpen] = useState(false);
  const toast = useToastHandler();
  const user = useUser();
  const createLabTestMutation = useCreateLabTest();

  const { control, reset } = useForge<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      test_type: '',
      specimen: '',
      entry_category: '',
      date_collected: '',
      notes: '',
    },
  });

  /**
   * Handles form submission for creating a new lab test
   * @param data - Form data containing test details
   */
  const handleSubmit = async (data: FormValues) => {
    try {
      const payload: CreateLabTestPayload = {
        lab_no: generateId(),
        ordered_by: user?.first_name + " " + user?.last_name || 'Unknown',
        test_type: data.test_type,
        entry_category: data.entry_category as 'outpatient' | 'inpatient' | 'emergency',
        date_collected: data.date_collected,
        specimen: data.specimen,
        status: 'draft',
      };

      await createLabTestMutation.mutateAsync({ patientId, payload });
      
      toast.success('Success', 'Lab test order created successfully');
      setOpen(false);
      reset();
      onTestCreated?.();
    } catch (error) {
      console.error('Error creating lab test:', error);
      const err = error as ApiResponseError;
      toast.error('Error', err?.message ?? 'Failed to create lab test order');
    }
  };

  const testTypeOptions = [
    { value: 'blood_test', label: 'Blood Test' },
    { value: 'urine_test', label: 'Urine Test' },
    { value: 'stool_test', label: 'Stool Test' },
    { value: 'x_ray', label: 'X-Ray' },
    { value: 'ct_scan', label: 'CT Scan' },
    { value: 'mri', label: 'MRI' },
    { value: 'ultrasound', label: 'Ultrasound' },
    { value: 'ecg', label: 'ECG' },
    { value: 'other', label: 'Other' },
  ];

  const specimenOptions = [
    { value: 'blood', label: 'Blood' },
    { value: 'urine', label: 'Urine' },
    { value: 'stool', label: 'Stool' },
    { value: 'saliva', label: 'Saliva' },
    { value: 'tissue', label: 'Tissue' },
    { value: 'swab', label: 'Swab' },
    { value: 'other', label: 'Other' },
  ];

  const entryCategoryOptions = [
    { value: 'outpatient', label: 'Outpatient' },
    { value: 'inpatient', label: 'Inpatient' },
    { value: 'emergency', label: 'Emergency' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Order Test
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order New Lab Test</DialogTitle>
          <DialogDescription>
            Create a new lab test order for this patient. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        
        <Forge control={control} onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/** Lab number is auto-generated and passed to API; field removed */}
            
            <Forger
              name="test_type"
              component={TextSelect}
              label="Test Type"
              placeholder="Select test type"
              options={testTypeOptions}
              required
            />
            
            <Forger
              name="specimen"
              component={TextSelect}
              label="Specimen"
              placeholder="Select specimen type"
              options={specimenOptions}
              required
            />
            
            <Forger
              name="entry_category"
              component={TextSelect}
              label="Entry Category"
              placeholder="Select entry category"
              options={entryCategoryOptions}
              required
            />
            
            <Forger
              name="date_collected"
              component={TextDateInput}
              label="Collection Date"
              placeholder="Select collection date"
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
              disabled={createLabTestMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createLabTestMutation.isPending}>
              {createLabTestMutation.isPending ? 'Creating...' : 'Create Order'}
            </Button>
          </div>
        </Forge>
      </DialogContent>
    </Dialog>
  );
}