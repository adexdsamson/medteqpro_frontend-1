"use client";

import { useParams } from "next/navigation";
import { usePatientDetails } from "@/features/services/patientService";
import LastSeenCardGroup from "./_components/LastSeenCardGroup";
import TabNavigation from "./_components/TabNavigation";
import PatientInfoSection from "./_components/PatientInfoSection";
import MedicalInfoSection from "./_components/MedicalInfoSection";
import SocialInfoSection from "./_components/SocialInfoSection";
import VitalSignsSection from "./_components/VitalSignsSection";
import DiagnosticReportSection from "./_components/DiagnosticReportSection";
import PrescriptionSection from "./_components/PrescriptionSection";
import MedicalTestSection from "./_components/MedicalTestSection";
// TabItem interface definition
interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.patientId as string;

  const { data: patientData, isLoading, error } = usePatientDetails(patientId);

  // Note: The usePatientDetails returns PatientType, but we need PatientDetailResponse
  // For now, we'll use mock data structure that matches our components
  const patient = patientData
    ? {
        ...patientData,
      }
    : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
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
              Error Loading Patient
            </h1>
            <p className="text-gray-600">
              Unable to load patient details. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Define tab items with their content
  const tabItems: TabItem[] = [
    {
      value: "personal-info",
      label: "Personal Information",
      content: <PatientInfoSection patient={patient} />,
    },
    {
      value: "medical-info",
      label: "Medical Info",
      content: <MedicalInfoSection patient={patient} />,
    },
    {
      value: "social-info",
      label: "Social Info",
      content: <SocialInfoSection patient={patient} />,
    },
    {
      value: "vital-signs",
      label: "Vital Signs Report",
      content: <VitalSignsSection />,
    },
    {
      value: "diagnostic",
      label: "Diagnostic Report",
      content: <DiagnosticReportSection />,
    },
    {
      value: "prescription",
      label: "Prescription Report",
      content: <PrescriptionSection />,
    },
    {
      value: "medical-test",
      label: "Medical Test",
      content: <MedicalTestSection />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">
          Patients / Patient Information
        </h1>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Last Seen Cards */}
        <div className="mb-8">
          <LastSeenCardGroup lastSeenData={patient?.last_seen} />
        </div>

        {/* Main Content Grid */}
        <TabNavigation items={tabItems} defaultValue="personal-info" />
      </div>
    </div>
  );
}
