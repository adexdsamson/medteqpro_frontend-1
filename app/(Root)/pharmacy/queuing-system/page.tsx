"use client";

import React, { useState, useEffect } from "react";
import Subheader from "../../_components/Subheader";
import { Button } from "@/components/ui/button";
import { useToastHandler } from "@/hooks/useToaster";

// Import custom components
import QueueTable, { QueueEntry } from "./_components/QueueTable";
// import AISuggestionCard from "./_components/AISuggestionCard";
// import AddToQueueDialog, { QueueFormData } from "./_components/AddToQueueDialog";

// Import services
import { 
  useGetQueueEntries, 
  // useAddQueueEntry,
  useUpdateQueueStatus,
  formatQueueDate,
  // AddQueueEntryRequest
} from "@/features/services/queueService";



export default function PharmacyQueuingSystem() {
  // State
  const [queueData, setQueueData] = useState<QueueEntry[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSessionActive] = useState<boolean>(true);
  
  // Hooks
  const handler = useToastHandler();
  
  // API Queries
  const { data: queueEntriesData, isLoading, isError, refetch } = useGetQueueEntries();
  // const { mutateAsync: addQueueEntry } = useAddQueueEntry();
  const { mutateAsync: updateQueueStatus } = useUpdateQueueStatus();
  
  // Load data from API when available
  useEffect(() => {
    if (queueEntriesData?.data) {
      // Transform API data to match our component's expected format
      const transformedData = queueEntriesData.data.map((item, index) => ({
        id: item.id,
        counter: index + 1,
        serialNumber: item.patient_id || `P00${index + 1}`,
        patientName: item.patient_fullname || `Patient ${index + 1}`,
        gender: item.patient_gender || (index % 2 === 0 ? "Female" : "Male"),
        estimatedTime: `${item.estimated_waiting_time || 0} mins`,
        status: item.status || 'waiting',
        priority: item.priority || 'medium',
        purpose: item.purpose || '',
        createdAt: item.created_at ? formatQueueDate(item.created_at) : '',
      }));
      
      setQueueData(transformedData);
    } else if (isError) {
      // If API fails, use sample data
      setQueueData([]);
    }
  }, [queueEntriesData, isError]);
  
  // Handle adding a new patient to the queue
  // const handleAddToQueue = async (data: QueueFormData) => {
  //   try {
  //     // Convert form data to API request format
  //     const requestData: AddQueueEntryRequest = {
  //       patient: data.serialNumber, // Using serialNumber as patient ID
  //       hospital_staff: data.gender, // Using gender field for hospital_staff ID (this is a workaround for the demo)
  //       purpose: "Pharmacy", // Default purpose
  //       priority: "medium", // Default priority
  //       estimated_waiting_time: parseInt(data.estimatedTime) || 30, // Convert to number
  //     };
      
  //     // Call the API
  //     const response = await addQueueEntry(requestData);
      
  //     if (response.status) {
  //       handler.success("Success", "Patient added to queue successfully");
  //       // Refresh the queue data
  //       refetch();
  //     } else {
  //       throw new Error(response.message);
  //     }
  //   } catch (error) {
  //     handler.error("Failed to add patient to queue");
  //     console.error(error);
  //   }
  // };
  
  // Handle starting a patient's consultation
  const handleStartPatient = async (queueId: string, status: string) => {
    try {
      // Update the queue status via API
      const response = await updateQueueStatus({ queue_id: queueId, status });
      if (response.status) {
        const statusText = status === "in_progress" ? "Started" : "Completed";
        handler.success(`Patient ${statusText}`, `${statusText} consultation for patient`);
        // Refresh the queue data
        refetch();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      handler.error("Failed to update patient status");
      console.error(error);
    }
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
      <Subheader title="Queuing System" />
      
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