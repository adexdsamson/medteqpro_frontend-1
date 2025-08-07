"use client";

import PatientContactCard from "./PatientContactCard";
import PatientStatusCard from "./PatientStatusCard";
import { PatientDetailResponse } from "./types";

interface SocialInfoSectionProps {
  patient?: PatientDetailResponse;
}

export default function SocialInfoSection({ patient }: SocialInfoSectionProps) {
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

  const socialInfoItems = [
    { label: "Do you smoke?", value: patient.social_history.smoking || "No" },
    {
      label: "Do you drink alcohol?",
      value: patient.social_history.alcohol || "No",
    },
    {
      label: "Any history of illegal drug?",
      value: patient.social_history.drug_use || "No",
    },
    {
      label: "Do you exercise?",
      value: patient.social_history.exercise || "No",
    },
    {
      label: "Are you on any special diet?",
      value: patient.social_history.diet || "No",
    },
  ];

  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex py-2">
      <div className="w-64 text-sm font-medium text-gray-700">{label}</div>
      <div className="text-sm text-blue-600">{value}</div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Social Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Social Information
            </h3>
            <div className="space-y-1">
              {socialInfoItems.map((item, index) => (
                <InfoItem key={index} label={item.label} value={item.value} />
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