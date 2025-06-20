"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/DataTable";
import { bedColumns, BedData } from "./_components/columns";
import Subheader from "../../_components/Subheader";
import { BedStats } from "./_components/BedStats";
import { TextInput } from "@/components/FormInputs/TextInput";
import { SearchIcon } from "lucide-react";
import SessionTimer from "../queuing-system/_components/SessionTimer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllBeds, mapBedResponseToUIModel } from "@/features/services/bedManagementService";
import { format, parseISO } from "date-fns";
import { useToastHandler } from "@/hooks/useToaster";

const AdminBedManagementPage = () => {
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("general");
  const [bedData, setBedData] = useState<BedData[]>([]);
  const [filteredBedData, setFilteredBedData] = useState<BedData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const toast = useToastHandler();
  
  // Fetch beds data using React Query
  const { data: bedsResponse, isLoading, error } = useGetAllBeds();
  
  // Process the API response
  useEffect(() => {
    if (bedsResponse?.data) {
      // Map API response to UI model and format dates
      const formattedBeds = bedsResponse.data?.data.map(bed => {
        const uiModel = mapBedResponseToUIModel(bed);
        
        // Format the allocation date time using date-fns if it exists
        if (uiModel.allocationDateTime) {
          try {
            const parsedDate = parseISO(uiModel.allocationDateTime);
            uiModel.allocationDateTime = format(parsedDate, "dd MMM yy, hh:mm a");
          } catch (e) {
            console.error("Date parsing error:", e);
          }
        }
        
        return uiModel;
      });
      
      setBedData(formattedBeds);
    }
  }, [bedsResponse]);
  
  // Filter data based on active tab and selected room
  useEffect(() => {
    if (bedData.length > 0) {
      let filtered = bedData;
      
      // Filter by ward type (based on room prefix)
      if (activeTab === "general") {
        filtered = filtered.filter(bed => bed.roomNo.startsWith('FW'));
      } else {
        filtered = filtered.filter(bed => bed.roomNo.startsWith('MW') || bed.roomNo.startsWith('RM'));
      }
      
      // Filter by room number if selected
      if (selectedRoom !== "all") {
        filtered = filtered.filter(bed => bed.roomNo === selectedRoom);
      }
      
      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(bed => 
          bed.bedId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (bed.patientId && bed.patientId.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      setFilteredBedData(filtered);
    }
  }, [bedData, activeTab, selectedRoom, searchTerm]);

  // Show error toast if API request fails
  useEffect(() => {
    if (error) {
      toast.error("Error", "Failed to load bed data. Please try again.");
    }
  }, [error, toast]);

  const totalBeds = filteredBedData.length;
  const occupiedBeds = filteredBedData.filter(bed => bed.patientId !== null).length;
  const availableBeds = totalBeds - occupiedBeds;

  // Get unique room numbers for the dropdown
  const roomNumbers = [...new Set(filteredBedData.map(bed => bed.roomNo))].sort();

  return (
    <div className="container mx-auto bg-gray-50 min-h-screen">
      <Subheader 
        title="Bed Management" 
        middle={
          <SessionTimer  />
        }
      />

      <div className="mb-6 p-6 flex justify-end items-center">
        <Button className="bg-blue-600 hover:bg-blue-700">Assign Bed</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-6">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="general"
              className="data-[state=active]:after:bg-blue-600 relative rounded-none py-2 px-4 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600"
            >
              General Ward
            </TabsTrigger>
            <TabsTrigger
              value="labour"
              className="data-[state=active]:after:bg-blue-600 relative rounded-none py-2 px-4 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600"
            >
              Labour Ward
            </TabsTrigger>
          </TabsList>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Create Ward +
          </Button>
        </div>

        <TabsContent value="general">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Select Room No</span>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {roomNumbers.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <BedStats 
                totalBeds={totalBeds}
                availableBeds={availableBeds}
                occupiedBeds={occupiedBeds}
              />
            </div>

            <div className="mb-6">
              <TextInput
                startAdornment={<SearchIcon className="h-5 w-5" />}
                label={"Search Keyword"}
                placeholder="Bed ID"
                containerClass="!w-60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DataTable
              columns={bedColumns}
              data={filteredBedData}
              options={{ isLoading }}
            />
          </div>
        </TabsContent>

        <TabsContent value="labour">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Select Room No</span>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {roomNumbers.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <BedStats 
                totalBeds={totalBeds}
                availableBeds={availableBeds}
                occupiedBeds={occupiedBeds}
              />
            </div>

            <div className="mb-6">
              <TextInput
                startAdornment={<SearchIcon className="h-5 w-5" />}
                label={"Search Keyword"}
                placeholder="Bed ID"
                containerClass="!w-60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DataTable
              columns={bedColumns}
              data={filteredBedData}
              options={{ isLoading }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminBedManagementPage;