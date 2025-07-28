import { PatientDetailResponse } from '@/app/(Root)/admin/patients/[patientId]/_components/types';

interface SocialInfoProps {
  patient?: PatientDetailResponse;
}

export default function SocialInfo({ patient }: SocialInfoProps) {
  if (!patient) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-64"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-base font-medium mb-4">Social Information</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Do you smoke?</p>
          <p className="text-sm font-medium">{patient.social_history?.smoking || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Do you drink alcohol?</p>
          <p className="text-sm font-medium">{patient.social_history?.alcohol || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Any history of illegal drug?</p>
          <p className="text-sm font-medium">{patient.social_history?.drug_use || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Do you exercise?</p>
          <p className="text-sm font-medium">{patient.social_history?.exercise || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Are you on any special diet?</p>
          <p className="text-sm font-medium">{patient.social_history?.diet || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}