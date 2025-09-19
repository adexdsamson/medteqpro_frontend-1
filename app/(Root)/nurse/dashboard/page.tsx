'use client';

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/layouts/StatCard";
import Subheader from "@/layouts/Subheader";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { PatientsIcon } from "@/components/icons/PatientsIcon";
import { WoundCareIcon } from "@/components/icons/WoundCareIcon";
import { InjectionsIcon } from "@/components/icons/InjectionsIcon";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import {
  useNurseDashboard,
  useUpcomingAppointments,
  useVisitationFrequencyAnalytics,
} from "@/features/services/dashboardService";
import { useToastHandler } from "@/hooks/useToaster";
import { SEOWrapper } from "@/components/SEO";

/**
 * Nurse Dashboard Page
 *
 * Displays nurse-specific KPIs, visitation frequency analytics (bar chart),
 * and a compact upcoming appointments widget.
 * Integrates real API data using @tanstack/react-query hooks from the service layer.
 *
 * @component
 * @example
 * return <NurseDashboard />
 */
const NurseDashboard = () => {
  const toast = useToastHandler();

  // Top-level nurse analytics (KPIs)
  const { data: dashboardData, isLoading, error } = useNurseDashboard();

  // Visitation frequency analytics (bar chart)
  const [visitFilter, setVisitFilter] = useState<"daily" | "monthly" | "yearly">("monthly");
  const {
    data: visitationData,
    error: visitError,
  } = useVisitationFrequencyAnalytics(visitFilter);

  // Upcoming appointments (right column widget)
  const {
    data: upcomingAppointmentsResp,
    isLoading: isUpcomingLoading,
    error: upcomingError,
  } = useUpcomingAppointments();

  // Handle error states with toasts
  useEffect(() => {
    if (error) toast.error("Error", error?.message ?? "Failed to load dashboard data");
  }, [error, toast]);

  useEffect(() => {
    if (visitError) toast.error("Error", visitError?.message ?? "Failed to load visitation analytics");
  }, [visitError, toast]);

  useEffect(() => {
    if (upcomingError) toast.error("Error", upcomingError?.message ?? "Failed to load upcoming appointments");
  }, [upcomingError, toast]);

  // Extract analytics KPIs
  const analytics = dashboardData?.data?.data;

  // Types for flexible API response mapping
  interface NameValue {
    label?: string;
    month?: string;
    name?: string;
    value?: number;
    count?: number;
    visits?: number;
  }

  interface UpcomingAppointmentAPI {
    id?: string | number;
    appointment_date?: string;
    date?: string;
    scheduled_date?: string;
    appointment_time?: string;
    time?: string;
    patient_fullname?: string;
    patient_name?: string;
    patient?: string;
    status?: string;
  }

  interface UpcomingAppointmentUI {
    id: string;
    date: string;
    time: string;
    patient: string;
    status: string;
  }

  /**
   * Extract array results from different API envelope shapes without mutating data.
   * Supports { data: { results: T[] } }, { data: { data: T[] } }, and { data: T[] }.
   *
   * @template T
   * @param resp - Unknown API response wrapper
   * @returns T[] Normalized list
   */
  function getResults<T>(resp: unknown): T[] {
    if (!resp || typeof resp !== "object") return [];
    const outer = resp as { data?: unknown };
    const dataField = outer.data;

    if (
      typeof dataField === "object" &&
      dataField !== null &&
      "results" in (dataField as Record<string, unknown>) &&
      Array.isArray((dataField as { results?: unknown }).results)
    ) {
      return ((dataField as { results?: unknown }).results as T[]) ?? [];
    }

    if (
      typeof dataField === "object" &&
      dataField !== null &&
      "data" in (dataField as Record<string, unknown>) &&
      Array.isArray((dataField as { data?: unknown }).data)
    ) {
      return ((dataField as { data?: unknown }).data as T[]) ?? [];
    }

    if (Array.isArray(dataField)) return (dataField as T[]) ?? [];

    return [];
  }

  // Prepare visitation chart data
  const barChartData = useMemo(() => {
    const rawContainer = (visitationData?.data as { data?: unknown } | undefined)?.data ?? visitationData?.data;

    if (Array.isArray(rawContainer)) {
      const arr = rawContainer as NameValue[];
      return arr.map((item, idx) => ({
        name: item.label || item.month || item.name || `${idx + 1}`,
        value: Number(item.value ?? item.count ?? item.visits ?? 0),
      }));
    }

    if (rawContainer && typeof rawContainer === "object") {
      const obj = rawContainer as Record<string, unknown>;
      return Object.keys(obj).map((k) => ({ name: k, value: Number(obj[k] as number) }));
    }

    return [];
  }, [visitationData]);

  // Prepare upcoming appointments UI list
  const upcomingAppointments = useMemo<UpcomingAppointmentUI[]>(() => {
    const results = getResults<UpcomingAppointmentAPI>(upcomingAppointmentsResp);
    return results.map((a) => ({
      id: String(a?.id ?? Math.random()),
      date: a?.appointment_date ?? a?.date ?? a?.scheduled_date ?? "",
      time: a?.appointment_time ?? a?.time ?? "",
      patient: a?.patient_fullname ?? a?.patient_name ?? a?.patient ?? "Patient",
      status: a?.status ?? "scheduled",
    }));
  }, [upcomingAppointmentsResp]);

  // Simple pager for the compact widget
  const [apptIndex, setApptIndex] = useState(0);
  const apptTotal = upcomingAppointments.length;
  const currentAppt = apptTotal > 0 ? upcomingAppointments[Math.min(apptIndex, apptTotal - 1)] : undefined;

  /**
   * Navigate to previous appointment card in the widget.
   * @returns void
   */
  const onPrev = () => setApptIndex((i) => Math.max(0, i - 1));

  /**
   * Navigate to next appointment card in the widget.
   * @returns void
   */
  const onNext = () => setApptIndex((i) => Math.min(apptTotal - 1, i + 1));

  return (
    <>
      {/* SEO for a private dashboard page */}
      <SEOWrapper
        title="Nurse Dashboard - SwiftPro eProcurement Portal"
        description="Monitor patient counts, wound care, injections, and appointments with real-time analytics on the Nurse dashboard."
        keywords="nurse dashboard, patient visits, upcoming appointments, medteq"
        canonical="/nurse/dashboard"
        robots="noindex, nofollow"
        ogImage="/assets/medteq-og-image.jpg"
        ogImageAlt="Medteq Nurse Dashboard overview"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Medteq Healthcare System",
        }}
      />

      <Subheader title="Dashboard" />
      <div className="p-6 space-y-6 min-h-screen bg-gray-50">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<PatientsIcon className="h-5 w-5 text-[#118795]" />}
            title="Patients"
            value={isLoading ? "--" : analytics?.no_of_patients ?? 0}
          />

          <StatCard
            icon={<WoundCareIcon className="h-5 w-5 text-[#118795]" />}
            title="Wound Care Patient"
            value={isLoading ? "--" : analytics?.no_of_wound_care_patients ?? 0}
          />

          <StatCard
            icon={<InjectionsIcon className="h-5 w-5 text-[#118795]" />}
            title="Injections Administered"
            value={isLoading ? "--" : analytics?.no_of_injections_administered ?? 0}
          />

          <StatCard
            icon={<CalendarIcon className="h-5 w-5 text-[#118795]" />}
            title="Upcoming Appointment"
            value={isLoading ? "--" : analytics?.no_of_upcoming_appointments ?? 0}
          />
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <Card className="p-6 shadow-sm col-span-2 border-0 flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button className="bg-[#F9F9F9] cursor-pointer font-medium text-xs p-1 rounded-md">
                  View Table
                </button>
                <button className="bg-white border cursor-pointer font-medium border-[#F1F4F8] text-xs p-1 rounded-sm">
                  Compare
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 text-sm rounded-md ${visitFilter === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  onClick={() => setVisitFilter('daily')}
                >
                  Daily
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${visitFilter === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  onClick={() => setVisitFilter('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${visitFilter === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  onClick={() => setVisitFilter('yearly')}
                >
                  Yearly
                </button>
              </div>
            </div>

            <div className="w-full">
              <ChartContainer
                config={{
                  value: {
                    color: "#118795",
                    label: "Patient Visits",
                  },
                }}
                className="min-h-[400px] w-full"
              >
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} tickMargin={8} stroke="#6B7280" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} tickMargin={8} stroke="#6B7280" />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="var(--color-value)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ChartContainer>
            </div>
          </Card>

          <Card className="p-6 shadow-sm border-0">
            <h2 className="text-sm sm:text-base font-medium text-center mb-4 sm:mb-6">Upcoming Appointments</h2>

            {apptTotal > 0 ? (
              <>
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4">
                  <div className="flex items-center justify-center gap-4 sm:gap-10 w-full mb-2">
                    <h3 className="text-sm sm:text-base font-medium">{currentAppt?.date || '—'}</h3>
                    <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm px-2 sm:px-0">
                  Hi Nurse, you have an appointment with {currentAppt?.patient} scheduled for this date {currentAppt?.time ? `at ${currentAppt?.time}` : ''}.
                </p>
              </>
            ) : (
              <p className="text-gray-600 text-xs sm:text-sm px-2 sm:px-0">No upcoming appointments.</p>
            )}

            <div className="flex items-center justify-between mt-6 sm:mt-8 px-2 sm:px-0">
              <button
                onClick={onPrev}
                disabled={apptIndex === 0 || isUpcomingLoading}
                className="text-blue-500 disabled:text-gray-400 hover:text-blue-600 text-sm sm:text-base touch-manipulation min-h-[44px] flex items-center"
              >
                Prev
              </button>
              <div className="text-xs sm:text-sm text-gray-500">
                {apptTotal > 0 ? `${Math.min(apptIndex + 1, apptTotal)}/${apptTotal}` : '0/0'}
              </div>
              <button
                onClick={onNext}
                disabled={apptIndex >= apptTotal - 1 || isUpcomingLoading}
                className="text-blue-500 disabled:text-gray-400 hover:text-blue-600 text-sm sm:text-base touch-manipulation min-h-[44px] flex items-center"
              >
                Next
              </button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default NurseDashboard;