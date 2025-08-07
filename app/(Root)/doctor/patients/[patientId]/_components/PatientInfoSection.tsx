"use client";

import PatientContactCard from "./PatientContactCard";
import PatientStatusCard from "./PatientStatusCard";
import { PatientDetailResponse } from "./types";

interface PatientInfoSectionProps {
  patient?: PatientDetailResponse;
}

function calculateAge(dateOfBirth: string): string {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return `${age} years`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
}

function formatGender(gender: string): string {
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

function formatMaritalStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function PatientInfoSection({
  patient,
}: PatientInfoSectionProps) {
  if (!patient) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
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

  const personalInfoItems = [
    { label: "Search Patient ID", value: patient.id },
    { label: "Patient - 5560", value: "" },
    { label: "Patient Name", value: patient.full_name },
    { label: "Gender", value: formatGender(patient.gender) },
    {
      label: "Date of Birth",
      value: `${formatDate(patient.date_of_birth)} (${calculateAge(
        patient.date_of_birth
      )})`,
    },
    {
      label: "Marital Status",
      value: formatMaritalStatus(patient.marital_status),
    },
  ];

  const addressItems = [
    { label: "Street", value: patient.address },
    { label: "City", value: patient.city },
    { label: "State", value: patient.state },
    { label: "Emergency Contact Name", value: patient.emergency_contact.name },
    {
      label: "Emergency Contact Phone Number",
      value: patient.emergency_contact.phone,
    },
    {
      label: "Emergency Contact Relationship",
      value: patient.emergency_contact.relationship || "N/A",
    },
  ];

  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex py-2">
      <div className="w-64 text-sm font-medium text-gray-700">{label}</div>
      <div className="text-sm text-gray-900">{value}</div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content - Tabs */}
        <div className="lg:col-span-2">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Personal Information
            </h3>
            <div className="space-y-1">
              {personalInfoItems.map((item, index) => (
                <InfoItem key={index} label={item.label} value={item.value} />
              ))}
            </div>
          </div>

          {/* Address Section */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Address
            </h3>
            <div className="space-y-1">
              {addressItems.map((item, index) => (
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