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
// import SessionTimer from "../queuing-system/_components/SessionTimer";
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

const AdminBedManagementPage = () => {
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
    if (bedsResponse?.data?.data) {
      // Get beds from the response - handle the nested data structure
      const wardBedsData = bedsResponse.data.data;
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

      console.log({ wardBeds, bedsResponse });

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

  console.log({ filteredBedData, bedsResponse });

  return (
    <div className="container mx-auto bg-gray-50 min-h-screen">
      <Subheader title="Bed Management" />

      <div className="mb-6 p-6 flex justify-end items-center">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setAssignBedDialogOpen(true)}
        >
          Assign Bed
        </Button>
      </div>

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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Create Ward +
              </Button>
            </DialogTrigger>
            <AddWardDialog />
          </Dialog>
        </div>

        {wards.map((ward) => (
          <TabsContent key={ward.id} value={ward.id}>
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
                columns={bedColumns(handleAssignBed)}
                data={filteredBedData}
                options={{ isLoading: isLoading || wardsLoading }}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <AssignBedDialog
        open={assignBedDialogOpen}
        onOpenChange={setAssignBedDialogOpen}
        wardId={activeTab}
        bedId={selectedBedId}
      />
    </div>
  );
};

export default AdminBedManagementPage;
