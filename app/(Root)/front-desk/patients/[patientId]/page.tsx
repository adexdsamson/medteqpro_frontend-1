"use client";

import { useParams } from "next/navigation";
import { usePatientDetails } from "@/features/services/patientService";
import { SEOWrapper } from "@/components/SEO";

// Reuse admin patient detail components
import LastSeenCardGroup from "@/app/(Root)/admin/patients/[patientId]/_components/LastSeenCardGroup";
import TabNavigation from "@/app/(Root)/admin/patients/[patientId]/_components/TabNavigation";
import PatientInfoSection from "@/app/(Root)/admin/patients/[patientId]/_components/PatientInfoSection";
import MedicalInfoSection from "@/app/(Root)/admin/patients/[patientId]/_components/MedicalInfoSection";
import SocialInfoSection from "@/app/(Root)/admin/patients/[patientId]/_components/SocialInfoSection";
import VitalSignsSection from "@/app/(Root)/admin/patients/[patientId]/_components/VitalSignsSection";
import DiagnosticReportSection from "@/app/(Root)/admin/patients/[patientId]/_components/DiagnosticReportSection";
import PrescriptionSection from "@/app/(Root)/admin/patients/[patientId]/_components/PrescriptionSection";
import MedicalTestSection from "@/app/(Root)/admin/patients/[patientId]/_components/MedicalTestSection";

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

  // Note: The usePatientDetails returns PatientType, but the detail components expect PatientDetailResponse
  // For now, we'll use a mock-enhanced structure that matches our components
  const patient = patientData
    ? {
        ...patientData,
        hospital: "Mock Hospital",
        family: "Mock Family",
        first_name: patientData.name.split(" ")[0] || "",
        last_name: patientData.name.split(" ").slice(1).join(" ") || "",
        middle_name: "",
        full_name: patientData.name,
        patient_type: "Regular",
        date_of_birth: "1980-03-22", // Mock date
        phone_number: "08012345678", // Mock phone
        email: "patient@example.com", // Mock email
        address: "No 7 Adoga Street, Bodore",
        city: "Lagos",
        state: "Lagos",
        employment_status: "Employed",
        height: 175,
        weight: 70,
        bmi: 22.9,
        blood_group: "O+",
        genotype: "AA",
        allergies: "None",
        chronic_conditions: "None",
        current_medications: [],
        family_history: "None",
        surgical_history: "None",
        hereditary_conditions: "None",
        other_conditions: "None",
        emergency_contact: {
          name: "Kola Fadipe James",
          phone: "08000000000",
          relationship: "Brother",
        },
        marital_status: "Married",
        social_history: {
          smoking: "No",
          alcohol: "Occasionally",
          drug_use: "No",
          exercise: "Regular",
          diet: "Balanced",
          sexual_history: "N/A",
          other_habits: "None",
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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
      <SEOWrapper
        title="Patient Information - SwiftPro eProcurement Portal"
        description="View comprehensive patient information, including personal, medical, and social details, with diagnostic and prescription records."
        keywords="patient details, medical info, social history, vital signs, diagnostic reports, prescriptions"
        canonical={`/front-desk/patients/${patientId}`}
        robots="noindex, nofollow"
        ogImage="/assets/medteq-og-image.jpg"
        ogImageAlt="Medteq patient details"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "MedicalPatient",
          name: patient?.full_name ?? "Patient",
          identifier: patient?.patientId ?? patientId,
        }}
      />
      {/* Header */}
      <div className="mb-6 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">
          Patients / Patient Information
        </h1>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Last Seen Cards */}
        <div className="mb-8">
          <LastSeenCardGroup />
        </div>

        {/* Main Content Grid */}
        <TabNavigation items={tabItems} defaultValue="personal-info" />
      </div>
    </div>
  );
}