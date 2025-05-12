'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Large, Lead, Small } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

const DoctorsMonitor = ({ 
  doctors = defaultDoctors, 
  className = "w-[35rem]" 
}: DoctorsMonitorProps) => {
  const [showAll, setShowAll] = useState(false);
  const displayDoctors = showAll ? doctors : doctors.slice(0, 3);
  
  return (
    <Card className={className}>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Large>Doctors Monitor</Large>
          
        </div>

        {displayDoctors.length > 0 ? (
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