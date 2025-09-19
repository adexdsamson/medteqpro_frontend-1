"use client";

import PatientDetailPage from "@/features/pages/patients/patient-details/page";

/**
 * PatientDetailPage
 *
 * Front-desk patient detail page that reuses admin detail components for feature parity.
 * Fetches patient details, shows loading and error states, renders last-seen KPIs,
 * and provides a tabbed interface for personal, medical, social, and report sections.
 *
 * Differences from Admin:
 * - Includes SEO meta via SEOWrapper suitable for dashboard pages (noindex, nofollow).
 * - Otherwise mirrors the Admin layout/behavior exactly.
 *
 * @returns The patient detail page UI.
 * @example
 * // Navigated via route: /front-desk/patients/[patientId]
 * export default function Page() { return <PatientDetailPage /> }
 */
export default function PatientDetail() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PatientDetailPage />
    </div>
  );
}