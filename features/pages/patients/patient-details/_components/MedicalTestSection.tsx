'use client';

import { useParams } from 'next/navigation';
import { DataTable } from '@/components/DataTable';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetPatientLabTests } from '@/features/services/labResultService';
import { medicalTestColumns } from './medical-test-columns';
import  PatientContactCard  from './PatientContactCard';
import { usePatientDetails } from '@/features/services/patientService';
import AddLabTestDialog from '@/features/pages/laboratory/_components/AddLabTestDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function MedicalTestSection() {
  const params = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const patientId = params.patientId as string;

  // Fetch medical test data
  const { data: testData, isLoading, error, refetch } = useGetPatientLabTests(patientId);

  // Fetch patient details for the contact card
  const { data: patientData, isLoading: isLoadingPatient } = usePatientDetails(patientId);

  const tests = testData?.data?.results || [];

  const handleTestCreated = () => {
    // Refetch the lab tests data after a new test is created
    refetch();
  };

  if (isLoading || isLoadingPatient) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-blue-600">Medical Test</h3>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-blue-600">Medical Test</h3>
        <div className="text-center py-12 text-red-500">
          <p>Error loading medical test data</p>
          <p className="text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Order Test button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-600">Medical Test</h3>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Order Test
        </Button>
        <AddLabTestDialog 
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          patientId={patientId}
          onSuccess={handleTestCreated}
        /> 
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Test results table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Test results table */}
          {Array.isArray(tests) && tests.length > 0 ? (
            <DataTable
              columns={medicalTestColumns}
              data={tests}
            />
          ) : (
            <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-lg">
              <p>No medical test results available</p>
              <p className="text-sm mt-2">Medical test results will be displayed here when available</p>
            </div>
          )}
        </div>

        {/* Right column - Patient contact card */}
        <div className="lg:col-span-1">
          <PatientContactCard 
            name={patientData?.first_name + " " + patientData?.last_name || "N/A"} 
            phone={patientData?.phone_number || "N/A"} 
          />
        </div>
      </div>
    </div>
  );
}