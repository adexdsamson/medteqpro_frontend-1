'use client';

import { useParams } from "next/navigation";
import { useGetPatientPrescriptions } from "@/features/services/prescriptionService";
import { DataTable } from "@/components/DataTable";
import { prescriptionColumns } from "./prescription-columns";
import PatientContactCard from "./PatientContactCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PrescriptionSection() {
  const params = useParams();
  const patientId = params.patientId as string;

  const { data: prescriptions, isLoading, error } = useGetPatientPrescriptions(patientId);

  const handleAddPrescription = () => {
    // TODO: Implement add prescription modal/form
    console.log('Add prescription for patient:', patientId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Prescription table skeleton */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
          
          {/* Right column - Patient contact skeleton */}
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
        <div className="text-center py-12 text-red-500">
          <p>Error loading prescriptions</p>
          <p className="text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Prescription table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-600">Prescription Report</h3>
            <Button 
              onClick={handleAddPrescription}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Prescription
            </Button>
          </div>
          
          {prescriptions && prescriptions.length > 0 ? (
             <div className="bg-white rounded-lg border">
               <DataTable 
                 columns={prescriptionColumns} 
                 data={prescriptions}
               />
             </div>
           ) : (
            <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
              <p>No prescriptions available</p>
              <p className="text-sm mt-2">Prescription reports will be displayed here when available</p>
            </div>
          )}
        </div>
        
        {/* Right column - Patient contact card */}
        <div className="lg:col-span-1 space-y-4">
          <PatientContactCard 
            name="Oluwatosin Chidimma Aminah"
            phone="09078376478"
          />
        </div>
      </div>
    </div>
  );
}