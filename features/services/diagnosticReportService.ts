/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { ApiResponseError } from "@/types";

export interface DiagnosticReport {
  id: string;
  dateTime: string;
  submittedBy: string;
  medicalDiagnosis: string;
  note?: string;
  hasNote: boolean;
}

export const usePatientDiagnosticReports = (patientId: string) => {
  return useQuery<DiagnosticReport[], ApiResponseError>({
    queryKey: ['diagnostic-reports', patientId],
    queryFn: async () => {
      const response = await getRequest({
        url: `patient-management/patients/${patientId}/diagnostic-reports/`
      });
      return response.data.results || response.data.data || [];
    },
    enabled: !!patientId,
  });
};