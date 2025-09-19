"use client";

import React, { useState } from "react";
import {
  useGetQueueEntries,
  useUpdateQueueStatus,
} from "@/features/services/queueService";
import { useToastHandler } from "@/hooks/useToaster";
import QueueTable from "./_components/QueueTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Subheader from "../../../../layouts/Subheader";

export default function LabScientistQueueingSystem() {
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const toast = useToastHandler();

  const { data: queueData, isLoading, refetch } = useGetQueueEntries();
  const { mutateAsync: updateStatus } = useUpdateQueueStatus();

  const queueEntries = queueData?.data || [];

  // Transform queue data to match the UI requirements
  const transformedData = queueEntries.map((entry, index) => ({
    id: entry.id,
    counter: index + 1,
    serialNumber: entry.patient_id,
    gender: entry.patient_gender,
    estimatedTime: `${entry.estimated_waiting_time}mins`,
    status: entry.status,
    priority: entry.priority,
    patientName: entry.patient_fullname,
    purpose: entry.purpose,
  }));

  const handleStartPatient = async (queueId: string, newStatus: string) => {
    try {
      await updateStatus({ queue_id: queueId, status: newStatus });

      if (newStatus === "in_progress") {
        setCurrentSession(queueId);
        toast.success("Success", "Patient session started");
      } else if (newStatus === "completed") {
        setCurrentSession(null);
        toast.success("Success", "Patient session completed");
      }

      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Error", "Failed to update patient status");
    }
  };

  const handleNextPatient = () => {
    const nextPatient = transformedData.find(
      (entry) => entry.status === "waiting"
    );
    if (nextPatient) {
      handleStartPatient(nextPatient.id, "in_progress");
    } else {
      toast.error("Info", "No patients waiting in queue");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading queue...</div>
      </div>
    );
  }

  return (
    <>
      <Subheader title="Queuing System" />
      <div className="p-6 space-y-6">
        {/* Priority Tabs */}
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="bg-teal-50 text-teal-700 border-teal-200 px-4 py-2"
          >
            High priority
          </Badge>
          <Badge
            variant="outline"
            className="text-gray-600 border-gray-200 px-4 py-2"
          >
            Others
          </Badge>
        </div>

        {/* Next Patient Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleNextPatient}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            disabled={!!currentSession}
          >
            Next Patient
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>
        
        {/* Queue Table */}
        <div className="bg-white rounded-lg border">
          <QueueTable
            data={transformedData}
            onStartPatient={handleStartPatient}
          />
        </div>

      </div>
    </>
  );
}
