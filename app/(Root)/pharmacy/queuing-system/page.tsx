"use client";

import React, { useState } from "react";
import Subheader from "../../_components/Subheader";
import { Button } from "@/components/ui/button";
import { StatCard } from "../../_components/StatCard";
import { Users } from "lucide-react";
import { faker } from "@faker-js/faker";
import { useToastHandlers } from "@/hooks/useToaster";

// Import custom components
import SessionTimer from "./_components/SessionTimer";
import QueueTable, { QueueEntry } from "./_components/QueueTable";
import AISuggestionCard from "./_components/AISuggestionCard";
import AddToQueueDialog, { QueueFormData } from "./_components/AddToQueueDialog";

// Import services
import { 
  useGetQueueEntries, 
//   useAddQueueEntry, 
} from "@/features/services/queueService";

// Generate sample queue data for demo purposes
const generateQueueData = (count: number): QueueEntry[] => {
  return Array.from({ length: count }, (_, i) => ({
    counter: i + 1,
    serialNumber: `P00${i + 1}`,
    gender: i % 2 === 0 ? "Female" : "Male",
    estimatedTime: "40mins",
  }));
};

export default function PharmacyQueuingSystem() {
  // State
  const [queueData, setQueueData] = useState<QueueEntry[]>(generateQueueData(4));
  const [sessionActive, setSessionActive] = useState<boolean>(true);
  const [patientsAttended] = useState<number>(2875); // Demo value
  
  // Hooks
  const handler = useToastHandlers();
  
  // API Queries
  const {  isLoading, isError } = useGetQueueEntries();
//   const { mutateAsync: addQueueEntry } = useAddQueueEntry();
  
  // Handle adding a new patient to the queue
  const handleAddToQueue = async (data: QueueFormData) => {
    try {
      // For demo purposes, we'll just update the local state
      const newEntry: QueueEntry = {
        counter: queueData.length + 1,
        serialNumber: data.serialNumber,
        gender: data.gender,
        estimatedTime: data.estimatedTime,
      };
      
      setQueueData([...queueData, newEntry]);
      
      handler.success("Success", "Patient added to queue successfully");
    } catch  {
      handler.error("Failed to add patient to queue");
    }
  };
  
  // Handle ending the current session
  const handleEndSession = () => {
    setSessionActive(false);
    handler.success("Session Ended", "The current queue session has been ended");
  };
  
  // Handle starting a patient's consultation
  const handleStartPatient = (entry: QueueEntry) => {
    handler.success("Patient Started", `Started consultation for ${entry.serialNumber}`);
  };
  
  // Handle next patient action
  const handleNextPatient = () => {
    if (queueData.length > 0) {
      const nextPatient = queueData[0];
      setQueueData(queueData.slice(1));
      handler.success("Next Patient", `Called ${nextPatient.serialNumber} for consultation`);
    }
  };

  return (
    <>
      <Subheader title="Queuing System" middle={<SessionTimer onEndSession={handleEndSession} />} />
      
      <div className="p-6 space-y-6 min-h-screen w-full bg-gray-50">
        {/* Header with Next Patient button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="border-teal-500 text-teal-600 bg-teal-50 hover:bg-teal-100"
              >
                High priority
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Others
              </Button>
            </div>
          </div>
          
          <Button 
            className="bg-teal-600 hover:bg-teal-700 text-white px-6"
            onClick={handleNextPatient}
            disabled={queueData.length === 0}
          >
            Next Patient
          </Button>
        </div>
        
        {/* Queue Table */}
        <div className="bg-white rounded-lg shadow-sm">
          {isLoading ? (
            <div className="text-center py-8">Loading queue data...</div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              Error loading queue data. Please try again.
            </div>
          ) : (
            <QueueTable data={queueData} onStartPatient={handleStartPatient} />
          )}
        </div>
      </div>
    </>
  );
}