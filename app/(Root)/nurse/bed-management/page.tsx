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
import AddWardDialog from "./_components/AddWardDialog";
import AssignBedDialog from "./_components/AssignBedDialog";
import CreateBedDialog from "./_components/CreateBedDialog";

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

      <div className="mb-4 sm:mb-6 p-3 sm:p-6 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end items-stretch sm:items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={'ghost'}
              className="w-full sm:w-auto touch-manipulation"
            >
              Create Bed
            </Button>
          </DialogTrigger>
          <CreateBedDialog />
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto touch-manipulation">
              Create Ward +
            </Button>
          </DialogTrigger>
          <AddWardDialog />
        </Dialog>
      </div>

      {wards.length > 0 ? (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full px-3 sm:px-6"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
            <TabsList className="h-auto rounded-none border-b bg-transparent p-0 w-full sm:w-auto overflow-x-auto">
              {wards.map((ward) => (
                <TabsTrigger
                  key={ward.id}
                  value={ward.id}
                  className="data-[state=active]:after:bg-blue-600 relative rounded-none py-2 px-3 sm:px-4 text-sm sm:text-base after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 touch-manipulation flex-shrink-0"
                >
                  {ward.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {wards.map((ward) => (
            <TabsContent key={ward.id} value={ward.id}>
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      Select Room No
                    </span>
                    <Select
                      value={selectedRoom}
                      onValueChange={setSelectedRoom}
                    >
                      <SelectTrigger className="w-full sm:w-32 h-9 sm:h-8 touch-manipulation">
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
                  <div className="w-full sm:w-auto">
                    <BedStats
                      totalBeds={totalBeds}
                      availableBeds={availableBeds}
                      occupiedBeds={occupiedBeds}
                    />
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <TextInput
                    startAdornment={<SearchIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                    label={"Search Keyword"}
                    placeholder="Bed ID"
                    containerClass="!w-full sm:!w-60 md:!w-72"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <DataTable
                  columns={bedColumns(handleAssignBed)}
                  data={filteredBedData}
                  options={{ isLoading: isLoading || wardsLoading }}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="px-6">
          <div className="flex justify-between items-center mb-6">
            <div className="h-auto rounded-none border-b bg-transparent p-0">
              <div className="text-gray-500 py-2 px-4">No wards available</div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Create Ward +
                </Button>
              </DialogTrigger>
              <AddWardDialog />
            </Dialog>
          </div>

          {/* Empty state placeholder */}
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Wards Available
            </h3>
            <p className="text-gray-500 text-center mb-6 max-w-md">
              Get started by creating your first ward. Wards help organize beds
              and manage patient allocation efficiently.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Create Your First Ward
                </Button>
              </DialogTrigger>
              <AddWardDialog />
            </Dialog>
          </div>
        </div>
      )}

      <AssignBedDialog
        open={assignBedDialogOpen}
        onOpenChange={setAssignBedDialogOpen}
        wardId={activeTab}
        bedId={selectedBedId}
      />
    </div>
  );
};

export default NurseBedManagementPage;
