import Image from "next/image";
import { PatientDetailResponse } from '@/app/(Root)/admin/patients/[patientId]/_components/types';

interface PersonalInformationProps {
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
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  });
}

export default function PersonalInformation({ patient }: PersonalInformationProps) {
  if (!patient) {
    return (
      <div className="space-y-4 flex flex-col gap-10 md:flex-row-reverse">
        <div className="bg-white rounded-lg p-6 flex-1">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4 flex flex-col gap-10 md:flex-row-reverse">
      <div className="bg-[white] rounded-lg p-2.5 h-max">
        <div className="bg-[#F1F4F8] rounded-lg p-3">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100">
              <Image
                src="/avatar.png"
                alt="Patient"
                width={32}
                height={32}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500">Patient Contact</p>
              <p className="text-sm font-medium">{patient.full_name}</p>
            </div>
          </div>
          <p className="text-sm font-medium text-text-primary ml-2">{patient.phone_number}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 flex-1">
        <h2 className="text-base font-medium text-gray-900 mb-6">
          Personal Information
        </h2>

        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Search Patient ID</p>
            <p className="text-sm font-medium">{patient.id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Patient Name</p>
            <p className="text-sm font-medium">{patient.full_name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Gender</p>
            <p className="text-sm font-medium">{patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
            <p className="text-sm font-medium">{formatDate(patient.date_of_birth)} ({calculateAge(patient.date_of_birth)})</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Marital Status</p>
            <p className="text-sm font-medium">{patient.marital_status.charAt(0).toUpperCase() + patient.marital_status.slice(1)}</p>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Address</h3>
            <div className="space-y-6">
              <div>
            <p className="text-xs text-gray-500 mb-1">Address</p>
            <p className="text-sm font-medium">{patient.address || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">City</p>
            <p className="text-sm font-medium">{patient.city || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">State</p>
            <p className="text-sm font-medium">{patient.state || 'N/A'}</p>
          </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Emergency Contact
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Emergency Contact Name
                </p>
                <p className="text-sm font-medium">{patient.emergency_contact?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Emergency Contact Phone Number
                </p>
                <p className="text-sm font-medium">{patient.emergency_contact?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Relationship
                </p>
                <p className="text-sm font-medium">{patient.emergency_contact?.relationship || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}