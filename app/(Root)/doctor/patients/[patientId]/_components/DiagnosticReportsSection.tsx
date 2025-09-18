'use client';

import { useParams } from 'next/navigation';
import { usePatientDiagnosticReports } from '@/features/services/diagnosticReportService';
import { DataTable } from '@/components/DataTable';
import { columns } from './diagnostic-report-columns';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import AddDiagnosticReportDialog from './AddDiagnosticReportDialog';

export default function DiagnosticReportsSection() {
  const params = useParams();
  const patientId = params.patientId as string;

  const { data: diagnosticReports, isLoading, refetch } = usePatientDiagnosticReports(patientId);

  const handleReportCreated = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Diagnostic Report</h3>
        <AddDiagnosticReportDialog patientId={patientId} onReportCreated={handleReportCreated}>
          <Button>Add New Record</Button>
        </AddDiagnosticReportDialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : diagnosticReports && diagnosticReports.length > 0 ? (
        <DataTable columns={columns} data={diagnosticReports} />
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No diagnostic reports data available</p>
          <p className="text-sm mt-2">Diagnostic reports will be displayed here when available</p>
        </div>
      )}
    </div>
  );
}