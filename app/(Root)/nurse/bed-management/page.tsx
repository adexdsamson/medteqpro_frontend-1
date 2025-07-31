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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllWards,
  useGetBedsInWard,
  mapBedResponseToUIModel,
  BedResponseType,
  WardResponseType,
} from "@/features/services/bedManagementService";
import { format, parseISO } from "date-fns";
import { useToastHandler } from "@/hooks/useToaster";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AssignBedDialog from "./_components/AssignBedDialog";

const NurseBedManagementPage = () => {
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("");
  const [bedData, setBedData] = useState<BedData[]>([]);
  const [filteredBedData, setFilteredBedData] = useState<BedData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignBedDialogOpen, setAssignBedDialogOpen] = useState(false);
  const [wards, setWards] = useState<WardResponseType[]>([]);
  const [selectedBedId, setSelectedBedId] = useState<string>("");

  const toast = useToastHandler();

  // Fetch wards data
  const {
    data: wardsResponse,
    isLoading: wardsLoading,
    error: wardsError,
  } = useGetAllWards();

  // Fetch beds for the active ward
  const { data: bedsResponse, isLoading, error } = useGetBedsInWard(activeTab);

  // Process wards data and set default active tab
  useEffect(() => {
    if (wardsResponse?.data?.data) {
      const wardsData = wardsResponse.data.data;
      setWards(wardsData);

      // Set the first ward as active tab if no tab is selected
      if (!activeTab && wardsData.length > 0) {
        setActiveTab(wardsData[0].id);
      }
    }
  }, [wardsResponse, activeTab]);

  // Process beds data for the active ward
  useEffect(() => {
    if (bedsResponse?.data?.results) {
      // Get beds from the response - handle the nested data structure
      const wardBedsData = bedsResponse.data.results;
      const wardBeds: BedResponseType[] = Array.isArray(wardBedsData)
        ? wardBedsData
        : wardBedsData.data || [];

      // Map API response to UI model and format dates
      const formattedBeds = wardBeds.map((bed) => {
        const uiModel = mapBedResponseToUIModel(bed);

        // Format the allocation date time using date-fns if it exists
        if (uiModel.allocationDateTime) {
          try {
            const parsedDate = parseISO(uiModel.allocationDateTime);
            uiModel.allocationDateTime = format(
              parsedDate,
              "dd MMM yy, hh:mm a"
            );
          } catch (e) {
            console.error("Date parsing error:", e);
          }
        }

        return uiModel;
      });

      setBedData(formattedBeds);
    } else {
      // Clear bed data if no beds response
      setBedData([]);
    }
  }, [bedsResponse]);

  // Filter data based on selected room and search term
  useEffect(() => {
    let filtered = bedData;

    // Filter by room number if selected
    if (selectedRoom !== "all") {
      filtered = filtered.filter((bed) => bed.roomNo === selectedRoom);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (bed) =>
          bed.bedId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (bed.patientId &&
            bed.patientId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredBedData(filtered);
  }, [bedData, selectedRoom, searchTerm]);

  // Show error toast if API request fails
  useEffect(() => {
    if (error) {
      toast.error("Error", "Failed to load bed data. Please try again.");
    }
    if (wardsError) {
      toast.error("Error", "Failed to load wards data. Please try again.");
    }
  }, [error, wardsError, toast]);

  // Reset selected room when active tab changes
  useEffect(() => {
    setSelectedRoom("all");
  }, [activeTab]);

  // Handle bed assignment
  const handleAssignBed = (bedId: string) => {
    setSelectedBedId(bedId);
    setAssignBedDialogOpen(true);
  };

  const totalBeds = filteredBedData.length;
  const occupiedBeds = filteredBedData.filter(
    (bed) => bed.patientId !== null
  ).length;
  const availableBeds = totalBeds - occupiedBeds;

  // Get unique room numbers for the dropdown
  const roomNumbers = [
    ...new Set(filteredBedData.map((bed) => bed.roomNo)),
  ].sort();

  return (
    <div className="container mx-auto bg-gray-50 min-h-screen">
      <Subheader title="Bed Management" />

      {wards.length > 0 ? (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full px-6"
        >
          <div className="flex justify-between items-center mb-6">
            <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
              {wards.map((ward) => (
                <TabsTrigger
                  key={ward.id}
                  value={ward.id}
                  className="data-[state=active]:after:bg-blue-600 relative rounded-none py-2 px-4 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600"
                >
                  {ward.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex gap-4 items-center">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <TextInput
                  type="text"
                  placeholder="Search beds..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Select
                value={selectedRoom}
                onValueChange={setSelectedRoom}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rooms</SelectItem>
                  {roomNumbers.map((room) => (
                    <SelectItem key={room} value={room}>
                      Room {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-6">
            <BedStats
              totalBeds={totalBeds}
              occupiedBeds={occupiedBeds}
              availableBeds={availableBeds}
            />
          </div>

          {wards.map((ward) => (
            <TabsContent key={ward.id} value={ward.id} className="mt-0">
              <DataTable
                columns={bedColumns(handleAssignBed)}
                data={filteredBedData}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                showSearch={false} // We're using custom search above
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No wards found</p>
          <p className="text-sm text-gray-400">
            Please contact your administrator to set up wards and beds.
          </p>
        </div>
      )}

      <AssignBedDialog
        open={assignBedDialogOpen}
        onOpenChange={setAssignBedDialogOpen}
        bedId={selectedBedId}
        wardId={activeTab}
        onSuccess={() => {
          // Refresh the data after successful assignment
          window.location.reload();
        }}
      />
    </div>
  );
};

export default NurseBedManagementPage;