"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";

// Sample lab result detail data
const getLabResultDetail = (id: string) => {
  // This would be fetched from an API in a real app
  return {
    id: parseInt(id),
    patient: {
      id: id === "1" || id === "3" ? "Patient-2234" : "Patient-3409",
      name: "Femi Babolola",
      age: "32 years",
      gender: "Male",
      bloodGroup: "O+",
    },
    test: {
      name: id === "1" || id === "2" ? "Malaria" : "Cough",
      type: "Internal",
      date: "22-May-24",
      time: "10:30 AM",
      labScientist: "Queen Gabara",
      status: "Completed",
    },
    results: [
      {
        parameter: "Plasmodium Falciparum",
        result: "Positive",
        reference: "Negative",
        unit: "",
        flag: "High",
      },
      {
        parameter: "Plasmodium Vivax",
        result: "Negative",
        reference: "Negative",
        unit: "",
        flag: "Normal",
      },
      {
        parameter: "Plasmodium Ovale",
        result: "Negative",
        reference: "Negative",
        unit: "",
        flag: "Normal",
      },
      {
        parameter: "Plasmodium Malariae",
        result: "Negative",
        reference: "Negative",
        unit: "",
        flag: "Normal",
      },
    ],
    notes: "Patient should take prescribed antimalarial medication and complete the full course. Adequate rest and hydration recommended. Follow-up in 7 days if symptoms persist.",
  };
};

const LabResultDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  // Get lab result details
  const labResult = getLabResultDetail(id);
  
  const handleBack = () => {
    router.push("/patient/lab-result");
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    // This would generate and download a PDF in a real app
    alert("Downloading report as PDF...");
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2 p-1"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Lab Result Detail</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          
          <Button 
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-4 col-span-1">
          <h2 className="text-base font-medium mb-3 pb-2 border-b">Patient Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Patient ID:</span>
              <span className="text-sm font-medium">{labResult.patient.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Name:</span>
              <span className="text-sm font-medium">{labResult.patient.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Age:</span>
              <span className="text-sm font-medium">{labResult.patient.age}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Gender:</span>
              <span className="text-sm font-medium">{labResult.patient.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Blood Group:</span>
              <span className="text-sm font-medium">{labResult.patient.bloodGroup}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 col-span-2">
          <h2 className="text-base font-medium mb-3 pb-2 border-b">Test Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Test Name:</span>
              <span className="text-sm font-medium">{labResult.test.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Test Type:</span>
              <span className="text-sm font-medium">{labResult.test.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Date:</span>
              <span className="text-sm font-medium">{labResult.test.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Time:</span>
              <span className="text-sm font-medium">{labResult.test.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Lab Scientist:</span>
              <span className="text-sm font-medium">{labResult.test.labScientist}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Status:</span>
              <span className="text-sm font-medium text-green-600">{labResult.test.status}</span>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="p-4 mb-6">
        <h2 className="text-base font-medium mb-3 pb-2 border-b">Test Results</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parameter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flag
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {labResult.results.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.parameter}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {item.result}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      item.flag === 'High' ? 'text-red-700 bg-red-100' : 
                      item.flag === 'Low' ? 'text-yellow-700 bg-yellow-100' : 
                      'text-green-700 bg-green-100'
                    }`}>
                      {item.flag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Card className="p-4">
        <h2 className="text-base font-medium mb-3 pb-2 border-b">Notes & Recommendations</h2>
        <p className="text-sm text-gray-700">{labResult.notes}</p>
      </Card>
    </div>
  );
};

export default LabResultDetailPage; 