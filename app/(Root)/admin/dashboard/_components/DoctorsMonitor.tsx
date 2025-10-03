'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Large, Lead, Small } from "@/components/ui/Typography";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { Skeleton } from "@/components/ui/skeleton";
import type { AxiosResponse } from "axios";
import type { ApiResponseError } from "@/types";

type DoctorStatus = "at-work" | "at-break" | "off-duty";

interface Doctor {
  id: string;
  name: string;
  schedule: string;
  patientCount: number;
  status: DoctorStatus;
}

interface DoctorsMonitorProps {
  doctors?: Doctor[];
  className?: string;
}

const StatusIndicator = ({ status }: { status: DoctorStatus }) => {
  const statusConfig = {
    "at-work": { text: "At Work", color: "text-green-500" },
    "at-break": { text: "At Break", color: "text-yellow-500" },
    "off-duty": { text: "Off Duty", color: "text-red-500" },
  };

  const { text, color } = statusConfig[status];

  return (
    <Small className={color} aria-label={`Status: ${text}`}>
      {text}
    </Small>
  );
};

const normalizeStatus = (value: unknown): DoctorStatus => {
  const s = String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-");

  if (s.includes("work") || s === "on-duty" || s === "on-shift" || s === "working") {
    return "at-work";
  }
  if (s.includes("break") || s === "rest" || s === "pause") {
    return "at-break";
  }
  return "off-duty";
};

type DoctorLike = Record<string, unknown>;
const isObject = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object";
const getField = (obj: DoctorLike, key: string): unknown => obj[key];

const mapDoctor = (item: DoctorLike, idx: number): Doctor => {
  const idSource =
    getField(item, "id") ??
    getField(item, "doctor_id") ??
    getField(item, "user_id") ??
    getField(item, "staff_id") ??
    idx;
  const id = String(idSource);

  const compositeName = [getField(item, "first_name"), getField(item, "last_name")]
    .filter(Boolean)
    .join(" ");
  const nameCandidate = getField(item, "name") ?? getField(item, "full_name") ?? compositeName;
  const name = typeof nameCandidate === "string" && nameCandidate.trim().length > 0 ? nameCandidate : `Doctor ${idx + 1}`;

  const scheduleCandidate =
    getField(item, "schedule") ??
    getField(item, "working_hours") ??
    getField(item, "shift") ??
    (getField(item, "start_time") && getField(item, "end_time")
      ? `${String(getField(item, "start_time"))} - ${String(getField(item, "end_time"))}`
      : undefined);
  const schedule = typeof scheduleCandidate === "string" && scheduleCandidate.trim().length > 0 ? scheduleCandidate : "08:00 - 17:00";

  const pcCandidate =
    getField(item, "patient_count") ??
    getField(item, "no_of_patients") ??
    getField(item, "patients_count") ??
    0;
  const n = Number(pcCandidate);
  const patientCount = Number.isFinite(n) ? n : 0;

  const status = normalizeStatus(
    getField(item, "status") ??
    getField(item, "current_status") ??
    getField(item, "availability") ??
    getField(item, "shift_status")
  );

  return { id, name, schedule, patientCount, status };
};

const DoctorsMonitor = ({ 
  doctors = defaultDoctors, 
  className = "w-[35rem]" 
}: DoctorsMonitorProps) => {
  const [showAll] = useState(false);
  const { data, isLoading, error } = useQuery<AxiosResponse<unknown>, ApiResponseError>({
    queryKey: ["doctors-monitor"],
    queryFn: async () => await getRequest({ url: "/dashboard/doctors-monitor/" }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const responseData = data?.data as unknown;
  let apiDoctorsArray: unknown[] = [];
  if (Array.isArray(responseData)) {
    apiDoctorsArray = responseData;
  } else if (isObject(responseData)) {
    const maybeDoctors = responseData["doctors"];
    const maybeResults = responseData["results"];
    const maybeData = responseData["data"];
    if (Array.isArray(maybeDoctors)) {
      apiDoctorsArray = maybeDoctors as unknown[];
    } else if (Array.isArray(maybeResults)) {
      apiDoctorsArray = maybeResults as unknown[];
    } else if (Array.isArray(maybeData)) {
      apiDoctorsArray = maybeData as unknown[];
    } else if (isObject(maybeData)) {
      const md = maybeData as Record<string, unknown>;
      const mdDoctors = md["doctors"];
      const mdResults = md["results"];
      if (Array.isArray(mdDoctors)) apiDoctorsArray = mdDoctors as unknown[];
      else if (Array.isArray(mdResults)) apiDoctorsArray = mdResults as unknown[];
    }
  }
  const apiDoctors: Doctor[] = apiDoctorsArray.map((item, idx) => mapDoctor(item as DoctorLike, idx));

  const effectiveDoctors = doctors?.length ? doctors : apiDoctors?.length ? apiDoctors : defaultDoctors;
  const displayDoctors = showAll ? effectiveDoctors : effectiveDoctors.slice(0, 3);
  
  return (
    <Card className={className}>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Large>Doctors Monitor</Large>
          
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between pt-3 border-b pb-2 border-gray-200">
                <div>
                  <Skeleton className="h-5 w-48 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">
            <Small>Failed to load doctors monitor.</Small>
          </div>
        ) : displayDoctors.length > 0 ? (
          <div className="space-y-3">
            {displayDoctors.map((doctor) => (
              <div 
                key={doctor.id} 
                className="flex items-center justify-between pt-3 border-b pb-2 border-gray-200"
              >
                <div>
                  <Lead>{doctor.name}</Lead>
                  <Small className="text-gray-500">{doctor.schedule}</Small>
                </div>
                <Small>{doctor.patientCount} patient{doctor.patientCount !== 1 ? 's' : ''}</Small>
                <StatusIndicator status={doctor.status} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <Small>No doctors available at the moment</Small>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Default data to use when not provided
const defaultDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Adeyemi Ade",
    schedule: "08:00 - 17:00",
    patientCount: 4,
    status: "at-work"
  },
  {
    id: "2",
    name: "Dr. Adisa kola",
    schedule: "08:00 - 17:00",
    patientCount: 4,
    status: "at-break"
  },
  {
    id: "3",
    name: "Dr. Adeyemi Ade",
    schedule: "08:00 - 17:00",
    patientCount: 4,
    status: "at-work"
  },
  {
    id: "4",
    name: "Dr. Sarah Johnson",
    schedule: "09:00 - 18:00",
    patientCount: 6,
    status: "at-work"
  },
  {
    id: "5",
    name: "Dr. Michael Smith",
    schedule: "07:00 - 16:00",
    patientCount: 2,
    status: "off-duty"
  }
];

export default DoctorsMonitor;