"use client";

import { useParams } from "next/navigation";
import { usePatientDiagnosticReports } from "@/features/services/diagnosticReportService";
import { DataTable } from "@/components/DataTable";
import { columns } from "./diagnostic-report-columns";
import { Skeleton } from "@/components/ui/skeleton";
import AddDiagnosticReportDialog from "./AddDiagnosticReportDialog";

export default function DiagnosticReportSection() {
  const params = useParams();
  const patientId = params.patientId as string;

  const {
    data,
    isLoading,
    refetch,
  } = usePatientDiagnosticReports(patientId);

  const diagnosticReports = data || [];

  /**
   * Handles successful creation of a new diagnostic report
   * Refetches the diagnostic reports list to show the new record
   */
  const handleReportCreated = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">
          Diagnostic Report
        </h3>
        <AddDiagnosticReportDialog
          patientId={patientId}
          onReportCreated={handleReportCreated}
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : diagnosticReports && diagnosticReports.length > 0 ? (
        <div className="w-full max-w-[76vw] bg-white p-2">
          <DataTable columns={columns} data={diagnosticReports} />
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No diagnostic reports data available</p>
          <p className="text-sm mt-2">
            Diagnostic reports will be displayed here when available
          </p>
        </div>
      )}
    </div>
  );
}
