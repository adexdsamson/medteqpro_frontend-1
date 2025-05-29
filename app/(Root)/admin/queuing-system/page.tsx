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
    serialNumber: i === 0 ? "P001" : i === 1 ? "Male" : i === 2 ? "Male" : "Female",
    patientId: `Patient-${faker.number.int({ min: 1000, max: 9999 })}`,
    roomAssigned: faker.number.int({ min: 100, max: 110 }).toString(),
    estimatedTime: "40mins",
  }));
};

export default function QueuingSystem() {
  // State
  const [queueData, setQueueData] = useState<QueueEntry[]>(generateQueueData(4));
  const [sessionActive, setSessionActive] = useState<boolean>(true);
  const [patientsAttended] = useState<number>(2875); // Demo value
  
  // Hooks
  const handler = useToastHandlers();
  
  // API Queries
  const {  isLoading, isError } = useGetQueueEntries();
//   const { mutateAsync: addQueueEntry } = useAddQueueEntry();
  
  // Load data from API when available
//   useEffect(() => {
//     if (queueEntriesData?.data) {
//       // Uncomment this when the API is ready
//       // setQueueData(queueEntriesData.data);
//     }
//   }, [queueEntriesData]);
  
  // Handle adding a new patient to the queue
  const handleAddToQueue = async (data: QueueFormData) => {
    try {
      // In a real implementation, we would call the API
    //   const response = await addQueueEntry({
      //   serialNumber: data.serialNumber,
      //   patientId: data.patientId,
      //   patientName: data.patientName,
      //   roomAssigned: data.roomAssigned,
      //   estimatedTime: data.estimatedTime,
    //   });
      // 
      // if (response.success) {
      //   toast({
      //     title: "Success",
      //     description: "Patient added to queue successfully",
      //     variant: "success",
      //   });
      // }
      
      // For demo purposes, we'll just update the local state
      const newEntry: QueueEntry = {
        counter: queueData.length + 1,
        serialNumber: data.serialNumber,
        patientId: data.patientId,
        roomAssigned: data.roomAssigned,
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
  
  // Handle displaying the queue on a public screen
  const handleDisplay = () => {
    handler.success("Display Updated", "Queue display has been updated on public screens");
  };

  return (
    <>
      <Subheader title="Queuing System" middle={<SessionTimer onEndSession={handleEndSession} />} />
      
      <div className="p-6 space-y-6 min-h-screen w-full bg-gray-50">
        {/* Timer and Add to Queue button */}
        <div className="flex justify-end items-center">
         
          
          {sessionActive ? (
            <AddToQueueDialog onAddToQueue={handleAddToQueue} />
          ) : (
            <Button 
              className="bg-blue-700 hover:bg-blue-800"
              onClick={() => setSessionActive(true)}
            >
              Start New Session
            </Button>
          )}
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <StatCard
            title="Number on Queue"
            value={queueData.length}
            icon={<Users className="h-5 w-5 text-blue-500" />}
          />
          <StatCard
            title="Patients Attended To"
            value={patientsAttended}
            icon={<Users className="h-5 w-5 text-blue-500" />}
          />
          <AISuggestionCard />
        </div>
        
        {/* Display Button */}
        <div className="flex justify-end mt-4">
          <Button 
            className="bg-gray-900 hover:bg-black"
            onClick={handleDisplay}
          >
            Display
          </Button>
        </div>
        
        {/* Queue Table */}
        <div className="mt-4">
          {isLoading ? (
            <div className="text-center py-8">Loading queue data...</div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              Error loading queue data. Please try again.
            </div>
          ) : (
            <QueueTable data={queueData} />
          )}
        </div>
      </div>
    </>
  );
}