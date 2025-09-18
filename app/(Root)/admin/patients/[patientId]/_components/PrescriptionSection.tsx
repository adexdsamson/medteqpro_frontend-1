"use client";

import { useParams } from "next/navigation";
import { useGetPatientPrescriptions } from "@/features/services/prescriptionService";
import { usePatientDetails } from "@/features/services/patientService";
import { DataTable } from "@/components/DataTable";
import { createPrescriptionColumns } from "./prescription-columns";
import PatientContactCard from "./PatientContactCard";
import { Skeleton } from "@/components/ui/skeleton";
import AddPrescriptionDialog from "./AddPrescriptionDialog";

export default function PrescriptionSection() {
  const params = useParams();
  const patientId = params.patientId as string;

  const {
    data: prescriptions,
    isLoading,
    error,
    refetch,
  } = useGetPatientPrescriptions(patientId);

  const {
    data: patientData,
    isLoading: isLoadingPatient,
  } = usePatientDetails(patientId);

  /**
   * Handles successful creation of a new prescription
   * Refetches the prescriptions list to show the new record
   */
  const handlePrescriptionCreated = () => {
    refetch();
  };

  if (isLoading || isLoadingPatient) {
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
            <h3 className="text-lg font-semibold text-blue-600">
              Prescription Report
            </h3>
            <AddPrescriptionDialog
              patientId={patientId}
              onPrescriptionCreated={handlePrescriptionCreated}
            />
          </div>

          {prescriptions && prescriptions.length > 0 ? (
            <div className="bg-white rounded-lg border">
              <DataTable columns={createPrescriptionColumns(patientId)} data={prescriptions} />
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
              <p>No prescriptions available</p>
              <p className="text-sm mt-2">
                Prescription reports will be displayed here when available
              </p>
            </div>
          )}
        </div>

        {/* Right column - Patient contact card */}
        <div className="lg:col-span-1 space-y-4">
          <PatientContactCard
            name={patientData?.full_name || "N/A"}
            phone={patientData?.phone_number || "N/A"}
          />
        </div>
      </div>
    </div>
  );
}
