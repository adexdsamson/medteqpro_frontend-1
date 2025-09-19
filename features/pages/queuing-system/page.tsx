"use client";

import React, { useState, useEffect } from "react";
import Subheader from "../../../layouts/Subheader";
import { Button } from "@/components/ui/button";
import { StatCard } from "../../../layouts/StatCard";
import { Users } from "lucide-react";
import { useToastHandler } from "@/hooks/useToaster";

// Import custom components
import QueueTable, { QueueEntry } from "./_components/QueueTable";
import AISuggestionCard from "./_components/AISuggestionCard";
import AddToQueueDialog, { QueueFormData } from "./_components/AddToQueueDialog";

// Import services
import { 
  useGetQueueEntries, 
  useAddQueueEntry,
  // useUpdateQueueStatus,
  formatQueueDate,
  AddQueueEntryRequest
} from "@/features/services/queueService";

/**
 * Queuing System Page Component
 * 
 * A centralized queuing system that manages patient queues across different hospital modules.
 * Provides functionality to add patients to queue, view queue status, and manage queue entries.
 * 
 * @returns {JSX.Element} The queuing system page component
 */
export default function QueuingSystemPage() {
  // State
  const [queueData, setQueueData] = useState<QueueEntry[]>([]);
  const [sessionActive, setSessionActive] = useState<boolean>(true);
  const [patientsAttended] = useState<number>(0);
  
  // Hooks
  const handler = useToastHandler();
  
  // API Queries
  const { data: queueEntriesData, isLoading, isError, refetch } = useGetQueueEntries();
  const { mutateAsync: addQueueEntry } = useAddQueueEntry();
  // const { mutateAsync: updateQueueStatus } = useUpdateQueueStatus();
  
  // Load data from API when available
  useEffect(() => {
    if (queueEntriesData?.data) {
      // Transform API data to match our component's expected format
      const transformedData = queueEntriesData.data.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        roomAssigned: item.assigned_hospital_staff_fullname || 'Unassigned',
        estimatedTime: `${item.estimated_waiting_time || 0} mins`,
        createdAt: item.created_at ? formatQueueDate(item.created_at) : '',
      }));
      
      setQueueData(transformedData);
    } else if (isError) {
      // If API fails, use sample data
      setQueueData([]);
    }
  }, [queueEntriesData, isError]);
  
  /**
   * Handle adding a new patient to the queue
   * @param {QueueFormData} data - The form data for the new queue entry
   */
  const handleAddToQueue = async (data: QueueFormData) => {
    try {
      // Form data now matches API request format directly
      const requestData: AddQueueEntryRequest = {
        patient: data.patient,
        hospital_staff: data.hospital_staff,
        purpose: data.purpose,
        priority: data.priority as "high" | "medium" | "low" | "urgent",
        estimated_waiting_time: data.estimated_waiting_time,
      };
      
      // Call the API
      const response = await addQueueEntry(requestData);
      
      if (response.status) {
        handler.success("Success", "Patient added to queue successfully");
        // Refresh the queue data
        refetch();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      handler.error("Failed to add patient to queue");
      console.error(error);
    }
  };

  
  // Handle displaying the queue on a public screen
  // const handleDisplay = () => {
  //   handler.success("Display Updated", "Queue display has been updated on public screens");
  // };
  
  // Handle updating a queue entry status
  // const handleUpdateStatus = async (queueId: string, status: string = 'in_progress') => {
  //   try {
  //     const response = await updateQueueStatus({ queue_id: queueId, status });
  //     if (response.status) {
  //       handler.success("Status Updated", "Queue status has been updated successfully");
  //       // Refresh the queue data
  //       refetch();
  //     } else {
  //       throw new Error(response.message);
  //     }
  //   } catch (error) {
  //     handler.error("Failed to update queue status");
  //     console.error(error);
  //   }
  // };

  return (
    <>
      <Subheader title="Queuing System"  />
      
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
        {/* <div className="flex justify-end mt-4">
          <Button 
            className="bg-gray-900 hover:bg-black"
            onClick={handleDisplay}
          >
            Display
          </Button>
        </div> */}
        
        {/* Queue Table */}
        <div className="mt-4">
          {isLoading ? (
            <div className="text-center py-8">Loading queue data...</div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              Error loading queue data. Please try again.
            </div>
          ) : (
            <QueueTable data={queueData}  />
          )}
        </div>
      </div>
    </>
  );
}