"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/DataTable";
import { bedColumns, BedData } from "./_components/columns";
import Subheader from "../../_components/Subheader";
import { BedStats } from "./_components/BedStats";
import { makeArrayData } from "@/demo";
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

const AdminBedManagementPage = () => {
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("general");

  // Dummy data for beds
  const bedData = makeArrayData<BedData>((faker) => {
    const isOccupied = faker.datatype.boolean();
    return {
      bedId: `Bed-${faker.number.int({ min: 1000, max: 9999 })}`,
      roomNo: `${faker.helpers.arrayElement(['FW', 'MW', 'RM'])}-${faker.number.int({ min: 1, max: 10 })}`,
      patientId: isOccupied ? `Patient-${faker.number.int({ min: 1000, max: 9999 })}` : null,
      allocationDateTime: isOccupied ? faker.date.recent().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) : null,
      duration: isOccupied ? faker.number.int({ min: 1, max: 30 }) : null,
    };
  });

  // Filter data based on active tab
  const filteredBedData = activeTab === "general" 
    ? bedData.filter(bed => bed.roomNo.startsWith('FW'))
    : bedData.filter(bed => bed.roomNo.startsWith('MW') || bed.roomNo.startsWith('RM'));

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
              />
            </div>

            <DataTable
              columns={bedColumns}
              data={selectedRoom === "all" || !selectedRoom ? filteredBedData : filteredBedData.filter(bed => bed.roomNo === selectedRoom)}
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
              />
            </div>

            <DataTable
              columns={bedColumns}
              data={selectedRoom === "all" || !selectedRoom ? filteredBedData : filteredBedData.filter(bed => bed.roomNo === selectedRoom)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminBedManagementPage;