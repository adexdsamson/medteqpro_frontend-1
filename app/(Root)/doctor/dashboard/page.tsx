"use client";

import React, { useMemo, useState } from "react";
import Subheader from "../../../../layouts/Subheader";
import { StatCard } from "../../../../layouts/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Large, P, Small } from "@/components/ui/Typography";
import {
  useDoctorDashboard,
  useDoctorDiagnosisAnalytics,
  useVisitationFrequencyAnalytics,
  useUpcomingAppointments,
} from "@/features/services/dashboardService";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarDays,
  Users,
  Eye,
  Activity,
  ClipboardList,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Types
interface NameValue {
  label?: string;
  month?: string;
  name?: string;
  value?: number;
  count?: number;
  visits?: number;
}

interface DiagnosisItem {
  diagnosis?: string;
  name?: string;
  number_of_patients?: number;
  count?: number;
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

// Helper to safely get list data from API responses of varying shapes
function getResults<T>(resp: unknown): T[] {
  if (!resp || typeof resp !== "object") return [];
  const outer = resp as { data?: unknown };
  const dataField = outer.data;

  // Case: { data: { results: T[] } }
  if (
    typeof dataField === "object" &&
    dataField !== null &&
    "results" in (dataField as Record<string, unknown>) &&
    Array.isArray((dataField as { results?: unknown }).results)
  ) {
    return ((dataField as { results?: unknown }).results as T[]) ?? [];
  }

  // Case: { data: { data: T[] } }
  if (
    typeof dataField === "object" &&
    dataField !== null &&
    "data" in (dataField as Record<string, unknown>) &&
    Array.isArray((dataField as { data?: unknown }).data)
  ) {
    return ((dataField as { data?: unknown }).data as T[]) ?? [];
  }

  // Case: { data: T[] }
  if (Array.isArray(dataField)) return (dataField as T[]) ?? [];

  return [];
}

// Colors for charts
const PIE_COLORS = ["#16C2D5", "#23B5D3", "#55DDE0", "#A1E3F9", "#D4F1F4"]; // teal/cyan palette

const DoctorDashboard = () => {
  // Top-level analytics
  const { data: doctorAnalytics, isLoading: isDashLoading } =
    useDoctorDashboard();

  // Diagnosis analytics for Pie + Top list
  const { data: diagnosisAnalytics, isLoading: isDiagnosisLoading } =
    useDoctorDiagnosisAnalytics();

  // Visitation frequency (bar chart)
  const [visitFilter, setVisitFilter] = useState<
    "daily" | "monthly" | "yearly"
  >("monthly");
  const { data: visitationData, isLoading: isVisitLoading } =
    useVisitationFrequencyAnalytics(visitFilter);

  // Upcoming appointments (right column)
  const { data: upcomingAppointmentsResp, isLoading: isUpcomingLoading } =
    useUpcomingAppointments();

  // Prepare chart data
  const barChartData = useMemo(() => {
    const rawContainer =
      (visitationData?.data as { data?: unknown } | undefined)?.data ??
      visitationData?.data;

    if (Array.isArray(rawContainer)) {
      const arr = rawContainer as NameValue[];
      return arr.map((item, idx) => ({
        name: item.label || item.month || item.name || `${idx + 1}`,
        value: Number(item.value ?? item.count ?? item.visits ?? 0),
      }));
    }

    if (rawContainer && typeof rawContainer === "object") {
      const obj = rawContainer as Record<string, unknown>;
      return Object.keys(obj).map((k) => ({
        name: k,
        value: Number(obj[k] as number),
      }));
    }

    return [];
  }, [visitationData]);

  const diagnosisList = useMemo(() => {
    const dataContainer =
      (diagnosisAnalytics?.data as { data?: unknown } | undefined)?.data ??
      diagnosisAnalytics?.data;
    let arr: DiagnosisItem[] = [];

    if (Array.isArray(dataContainer)) arr = dataContainer as DiagnosisItem[];
    else if (
      dataContainer &&
      typeof dataContainer === "object" &&
      "diagnoses" in (dataContainer as Record<string, unknown>)
    ) {
      arr = ((dataContainer as { diagnoses?: DiagnosisItem[] }).diagnoses ??
        []) as DiagnosisItem[];
    }

    return arr
      .map((d) => ({
        diagnosis: d?.diagnosis ?? d?.name ?? "Unknown",
        count: Number(d?.number_of_patients ?? d?.count ?? 0),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [diagnosisAnalytics]);

  const pieData = useMemo(() => {
    const total = diagnosisList.reduce((sum, d) => sum + d.count, 0) || 1;
    return diagnosisList.map((d, i) => ({
      name: d.diagnosis,
      value: d.count,
      percentage: Math.round((d.count / total) * 100),
      fill: PIE_COLORS[i % PIE_COLORS.length],
    }));
  }, [diagnosisList]);

  const upcomingAppointments = useMemo<UpcomingAppointmentUI[]>(() => {
    const results = getResults<UpcomingAppointmentAPI>(
      upcomingAppointmentsResp
    );
    return results.map((a) => ({
      id: String(a?.id ?? Math.random()),
      date: a?.appointment_date ?? a?.date ?? a?.scheduled_date ?? "",
      time: a?.appointment_time ?? a?.time ?? "",
      patient:
        a?.patient_fullname ?? a?.patient_name ?? a?.patient ?? "Patient",
      status: a?.status ?? "scheduled",
    }));
  }, [upcomingAppointmentsResp]);

  return (
    <>
      <Subheader title="Dashboard" />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen w-full">
        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <StatCard
            title="My Patients"
            value={doctorAnalytics?.data?.data?.my_patients ?? 0}
            icon={<Users className="h-5 w-5 text-[#16C2D5]" />}
            className="bg-white"
            bottom={
              isDashLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <p className="text-sm text-muted-foreground">My Patients</p>
              )
            }
          />
          <StatCard
            title="My Patient Visits"
            value={doctorAnalytics?.data?.data?.my_patient_visits ?? 0}
            icon={<CalendarDays className="h-5 w-5 text-[#16C2D5]" />}
            className="bg-white"
            bottom={
              isDashLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <p className="text-sm text-muted-foreground">
                  My Patient Visits
                </p>
              )
            }
          />
          <StatCard
            title="Patient Observed"
            value={doctorAnalytics?.data?.data?.patients_observed ?? 0}
            icon={<Eye className="h-5 w-5 text-[#16C2D5]" />}
            className="bg-white"
            bottom={
              isDashLoading ? (
                <Skeleton className="h-4 w-28" />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Patient Observed
                </p>
              )
            }
          />
          <StatCard
            title="Patient Admitted"
            value={doctorAnalytics?.data?.data?.patients_admitted ?? 0}
            icon={<Activity className="h-5 w-5 text-[#16C2D5]" />}
            className="bg-white"
            bottom={
              isDashLoading ? (
                <Skeleton className="h-4 w-28" />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Patient Admitted
                </p>
              )
            }
          />
          <StatCard
            title="Upcoming Appointment"
            value={doctorAnalytics?.data?.data?.no_of_upcoming_appointments ?? 0}
            icon={<ClipboardList className="h-5 w-5 text-[#16C2D5]" />}
            className="bg-white"
            bottom={
              isDashLoading ? (
                <Skeleton className="h-4 w-40" />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Upcoming Appointment
                </p>
              )
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Visitation Frequency Bar Chart */}
          <Card className="bg-white lg:col-span-2">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 sm:gap-0">
                <div className="flex items-center gap-2 overflow-x-auto">
                  <div className="p-2.5 bg-gray-100 rounded-md flex-shrink-0">
                    <Small>View Table</Small>
                  </div>
                  <div className="p-2.5 bg-white border rounded-md flex-shrink-0">
                    <Small>Compare</Small>
                  </div>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                  {(["daily", "monthly", "yearly"] as const).map((k) => (
                    <Button
                      key={k}
                      variant={visitFilter === k ? "default" : "outline"}
                      size="sm"
                      className={`${
                        visitFilter === k
                          ? "bg-[#16C2D5] hover:bg-[#14a8b8] text-white"
                          : ""
                      } touch-manipulation flex-shrink-0 text-xs sm:text-sm`}
                      onClick={() => setVisitFilter(k)}
                    >
                      {k.charAt(0).toUpperCase() + k.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <ChartContainer
                config={{ value: { label: "Visits", color: "#16C2D5" } }}
                className="h-64 sm:h-72 w-full"
              >
                {isVisitLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-8 w-64" />
                  </div>
                ) : (
                  <BarChart data={barChartData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#16C2D5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ChartContainer>
              <P className="text-center text-xs text-gray-500 mt-2">
                Showing {visitFilter} patients visitation frequency
              </P>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="bg-white">
            <CardContent className="p-3 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <Large className="text-lg sm:text-xl">
                  Upcoming Appointments
                </Large>
                {/* Placeholder for date selection inside card if needed */}
              </div>
              {isUpcomingLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : upcomingAppointments.length === 0 ? (
                <P className="text-sm text-muted-foreground">
                  No upcoming appointments
                </P>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {upcomingAppointments.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      className="p-2 sm:p-3 border rounded-md touch-manipulation"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <P className="font-medium text-sm sm:text-base truncate">
                          {a.patient}
                        </P>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-[#16C2D5] capitalize flex-shrink-0">
                          {a.status}
                        </span>
                      </div>
                      <P className="text-xs text-gray-500 mt-1">
                        {a.date} {a.time ? `• ${a.time}` : ""}
                      </P>
                    </div>
                  ))}
                </div>
              )}
              {/* Simple pagination indicator */}
              {upcomingAppointments.length > 4 && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Prev</span>
                  <span>1/{Math.ceil(upcomingAppointments.length / 4)}</span>
                  <span>Next</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Diagnosis charts and list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Pie Chart */}
          <Card className="bg-white">
            <CardContent className="p-3 sm:p-6">
              <Large className="text-lg sm:text-xl">
                Diagnosis Distribution
              </Large>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
                {isDiagnosisLoading ? (
                  <Skeleton className="h-44 w-44 rounded-full justify-self-center" />
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <PieChart
                      width={200}
                      height={200}
                      className="sm:w-[220px] sm:h-[220px]"
                    >
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        label={(p) => `${p.payload.percentage}%`}
                        className="sm:outerRadius-[90] sm:innerRadius-[50]"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.fill as string}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                )}
                <div className="space-y-2">
                  {isDiagnosisLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Skeleton className="h-3 w-3 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))
                    : pieData.map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ backgroundColor: d.fill as string }}
                          />
                          <Small>
                            {d.name} - {d.percentage}%
                          </Small>
                        </div>
                      ))}
                </div>
              </div>
              <P className="text-center text-xs text-gray-500 mt-2">
                Showing percentage of diagnosis done
              </P>
            </CardContent>
          </Card>

          {/* Top 5 Diagnoses Done */}
          <Card className="bg-white">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between mb-2 gap-2">
                <Large className="text-lg sm:text-xl">
                  Top 5 Diagnoses Done
                </Large>
                <Button
                  variant="link"
                  className="text-[#16C2D5] p-0 h-auto text-sm sm:text-base touch-manipulation flex-shrink-0"
                >
                  See All
                </Button>
              </div>
              {isDiagnosisLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 text-xs text-gray-500 px-2 py-1">
                    <span>Diagnosis</span>
                    <span className="text-right">Number of Patients</span>
                  </div>
                  <div className="divide-y">
                    {diagnosisList.map((d, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-2 items-center px-2 py-2 sm:py-3 touch-manipulation hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor:
                                PIE_COLORS[i % PIE_COLORS.length],
                            }}
                          ></div>
                          <span className="text-sm truncate pr-2">
                            {d.diagnosis}
                          </span>
                        </div>
                        <span className="text-sm text-right font-medium flex-shrink-0">
                          {d.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;
