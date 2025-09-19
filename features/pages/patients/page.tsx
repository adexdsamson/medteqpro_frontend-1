"use client";

import React, { useState } from "react";
import Subheader from "../../../layouts/Subheader";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import PatientTable from "./_components/patient-table";
import {
  useFamiliesList,
  usePatientList,
} from "@/features/services/patientService";
import CreatePatientDialog from "./_components/CreatePatientDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FamilyTable from "./_components/family-table";
import CreateFamilyDialog from "./_components/CreateFamilyDialog";

const AdminPatientPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("individual");
  const { data: patients = [], isLoading } = usePatientList({
    search: searchTerm || undefined,
  });
  const { data: families = [] } = useFamiliesList();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <Subheader title="Patient Management" />
      <div className="p-6 space-y-6 min-h-screen w-full">
        <div className="space-y-4">
          <div className="flex justify-end">
            {activeTab === "family" ? (
              <CreateFamilyDialog>
                <Button>Create Family</Button>
              </CreateFamilyDialog>
            ) : (
              <CreatePatientDialog>
                <Button>Add Patient</Button>
              </CreatePatientDialog>
            )}
          </div>

          <div className="flex items-center gap-2 w-fit bg-white p-2 ">
            <Search className="text-gray-400" size={20} />
            <input
              placeholder="Patient name/ID"
              className="w-full border-0 ring-0 focus-within:border-0 focus-visible:border-0 focus-visible:outline-0"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger
                value="individual"
                className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Individual
              </TabsTrigger>
              <TabsTrigger
                value="family"
                className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Family
              </TabsTrigger>
            </TabsList>
            <TabsContent value="individual">
              <PatientTable data={patients} />
            </TabsContent>
            <TabsContent value="family">
              <FamilyTable data={families} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default AdminPatientPage;
