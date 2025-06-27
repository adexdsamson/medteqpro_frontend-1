"use client";

import React, { useState } from "react";
import { useGetPatientPrescriptions } from "@/features/services/prescriptionService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Pill } from "lucide-react";

const PrescriptionPage = () => {
  // For demo purposes, using a hardcoded patient ID
  // In a real app, this would come from authentication context or route params
  const [patientId] = useState("3c37720b-1fc6-4888-9347-37b9ce75ab51");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  const { data: prescriptions, isLoading, error } = useGetPatientPrescriptions(patientId, {
    medicine_name: searchTerm || undefined,
    start_date: dateFilter || undefined,
  });

  const filteredPrescriptions = prescriptions?.filter(prescription => 
    prescription.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen">
        <h1 className="text-xl font-semibold mb-4">Prescriptions</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading prescriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen">
        <h1 className="text-xl font-semibold mb-4">Prescriptions</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading prescriptions. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Prescriptions</h1>
      
      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4 md:space-y-0 md:flex md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by medicine name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="date"
            placeholder="Filter by date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => {
            setSearchTerm("");
            setDateFilter("");
          }}
        >
          Clear Filters
        </Button>
      </div>

      {/* Prescriptions List */}
      {filteredPrescriptions.length === 0 ? (
        <div className="text-center py-12">
          <Pill className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
          <p className="text-gray-600">
            {searchTerm || dateFilter 
              ? "No prescriptions match your current filters." 
              : "You don't have any prescriptions yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-blue-900">
                  {prescription.medicineName}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {prescription.duration} days
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {prescription.formattedCreatedAt}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Dosage:</span>
                    <p className="text-gray-600">{prescription.dosage}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Frequency:</span>
                    <p className="text-gray-600">{prescription.frequency}</p>
                  </div>
                </div>
                {prescription.notes && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Notes:</span>
                    <p className="text-gray-600 mt-1">{prescription.notes}</p>
                  </div>
                )}
                <div className="text-xs text-gray-500 pt-2 border-t">
                  Last updated: {prescription.formattedUpdatedAt}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrescriptionPage;