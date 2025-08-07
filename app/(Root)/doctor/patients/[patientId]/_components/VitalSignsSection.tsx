'use client';

import { useParams } from 'next/navigation';
import { usePatientVitalSigns } from '@/features/services/vitalSignsService';
import { DataTable } from '@/components/DataTable';
import { columns } from './vital-signs-columns';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function VitalSignsSection() {
  const params = useParams();
  const patientId = params.patientId as string;

  const { data: vitalSigns, isLoading } = usePatientVitalSigns(patientId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Vital Signs Report</h3>
        <Button>Add New Record</Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : vitalSigns && vitalSigns.length > 0 ? (
        <DataTable columns={columns} data={vitalSigns} />
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No vital signs data available</p>
          <p className="text-sm mt-2">Vital signs will be displayed here when available</p>
        </div>
      )}
    </div>
  );
}