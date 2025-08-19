import { PatientDetailResponse } from '@/app/(Root)/admin/patients/[patientId]/_components/types';

interface MedicalInfoProps {
  patient?: PatientDetailResponse;
}

export default function MedicalInfo({ patient }: MedicalInfoProps) {
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
    <div className="bg-white rounded-lg p-3 sm:p-6">
      <h2 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">Medical Information</h2>
      <div className="space-y-3 sm:space-y-4">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Current Medications</p>
          <div className="text-xs sm:text-sm font-medium">
            {patient.current_medications && patient.current_medications.length > 0 ? (
              patient.current_medications.map((med, index) => (
                <div key={index} className="mb-1 p-2 bg-gray-50 rounded text-xs sm:text-sm">
                  <span className="block sm:inline">{med.medication}</span>
                  <span className="block sm:inline sm:before:content-['/'] sm:before:mx-1">{med.dosage}</span>
                  <span className="block sm:inline sm:before:content-['/'] sm:before:mx-1">{med.frequency}</span>
                </div>
              ))
            ) : (
              <span className="text-gray-400">N/A</span>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Any Allergies to Medication or Food (list reactions)?</p>
          <p className="text-xs sm:text-sm font-medium">{patient.allergies || <span className="text-gray-400">N/A</span>}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Family Medical History</p>
          <p className="text-sm font-medium">{patient.family_history || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Hereditary Disease</p>
          <p className="text-sm font-medium">{patient.hereditary_conditions || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Surgery History</p>
          <p className="text-sm font-medium">{patient.surgical_history || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}