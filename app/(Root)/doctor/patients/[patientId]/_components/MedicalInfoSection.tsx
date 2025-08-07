"use client";

import PatientContactCard from "./PatientContactCard";
import PatientStatusCard from "./PatientStatusCard";
import { PatientDetailResponse, Medication } from "./types";

interface MedicalInfoSectionProps {
  patient?: PatientDetailResponse;
}

function formatMedication(medications: Medication[]): string {
  if (!medications || medications.length === 0) {
    return "N/A";
  }

  // Format the first medication as a stylized link
  const firstMed = medications[0];
  return `${firstMed.medication} / ${firstMed.dosage} / ${firstMed.frequency}`;
}

export default function MedicalInfoSection({
  patient,
}: MedicalInfoSectionProps) {
  if (!patient) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex">
                <div className="h-4 bg-gray-200 rounded w-32 mr-4"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const medicalInfoItems = [
    {
      label: "Medication / Dosage / Frequency",
      value: formatMedication(patient.current_medications),
      isLink: true,
    },
    {
      label: "Any Allergies to Medication or Food (list reactions)?",
      value: patient.allergies || "N/A",
    },
    {
      label: "Family Medical History",
      value: patient.family_history || "N/A",
    },
    {
      label: "Hereditary Disease",
      value: patient.hereditary_conditions || "N/A",
    },
    {
      label: "Surgery History",
      value: patient.surgical_history || "N/A",
    },
  ];

  const InfoItem = ({
    label,
    value,
    isLink = false,
  }: {
    label: string;
    value: string;
    isLink?: boolean;
  }) => (
    <div className="flex py-2">
      <div className="w-64 text-sm font-medium text-gray-700">{label}</div>
      <div
        className={`text-sm ${
          isLink
            ? "text-blue-600 hover:text-blue-800 cursor-pointer underline"
            : "text-gray-900"
        }`}
      >
        {value}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content - Tabs */}
        <div className="lg:col-span-2">
          {/* Medical Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Medical Information
            </h3>
            <div className="space-y-1">
              {medicalInfoItems.map((item, index) => (
                <InfoItem
                  key={index}
                  label={item.label}
                  value={item.value}
                  isLink={item.isLink}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Patient Contact Card */}
          <PatientContactCard
            name={patient?.full_name || "Loading..."}
            phone={patient?.phone_number || "Loading..."}
          />

          {/* Patient Status Card */}
          <PatientStatusCard
            status="Okay to Attend"
            statusColor="bg-green-100 text-green-800"
          />
        </div>
      </div>
    </div>
  );
}