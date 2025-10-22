"use client";

import React from "react";
import { useParams } from "next/navigation";
import { usePatientList } from "@/features/services/patientService";
import { DataTable } from "@/components/DataTable";
import { columns as patientColumns } from "../_components/patient-table";

export default function FamilyDetailPage() {
  const params = useParams();
  const familyId = params.familyId as string;

  const { data: members = [], isLoading, error } = usePatientList({
    family_id: familyId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Error Loading Family Members
            </h1>
            <p className="text-gray-600">
              Unable to load family members. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 bg-white p-3">
        <h1 className="text-base font-bold text-gray-900">
          Patients / Family Members
        </h1>
        <p className="text-xs text-muted-foreground">Family ID: {familyId}</p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-3">
          <div className="w-full">
            <DataTable
              columns={patientColumns}
              data={members || []}
              options={{
                disableSelection: true,
                manualPagination: false,
                totalCounts: members?.length || 0,
                isLoading: false,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}