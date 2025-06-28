"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useGetLabTestDetail, formatLabDate } from "@/features/services/labResultService";
import { Skeleton } from "@/components/ui/skeleton";

const LabResultDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  // Get lab result details from API
  const { data, isLoading, isError, error } = useGetLabTestDetail(id);
  const labResult = data?.data?.data;
  
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

  // Handle loading state
  if (isLoading) {
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
        </div>
        
        <div className="space-y-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (isError || !labResult) {
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
        </div>
        
        <div className="p-6 text-center">
          <p className="text-red-500">Error loading lab result details: {error?.message || "Lab result not found"}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleBack}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
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
              <span className="text-sm font-medium">{labResult?.id || labResult.patient}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Name:</span>
              <span className="text-sm font-medium">{labResult.patient_details?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Age:</span>
              <span className="text-sm font-medium">{labResult.patient_details?.age || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Gender:</span>
              <span className="text-sm font-medium">{labResult.patient_details?.gender || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Blood Group:</span>
              <span className="text-sm font-medium">{labResult.patient_details?.blood_group || 'N/A'}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 col-span-2">
          <h2 className="text-base font-medium mb-3 pb-2 border-b">Test Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Test Name:</span>
              <span className="text-sm font-medium">{labResult.test_type_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Test Type:</span>
              <span className="text-sm font-medium">{labResult.test_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Date:</span>
              <span className="text-sm font-medium">{formatLabDate(labResult.test_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Time:</span>
              <span className="text-sm font-medium">{labResult.created_at}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Lab Scientist:</span>
              <span className="text-sm font-medium">{labResult.ordered_by_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Status:</span>
              <span className={`text-sm font-medium ${
                labResult.status === 'completed' ? 'text-green-600' : 
                labResult.status === 'pending' ? 'text-yellow-600' : 
                'text-gray-600'
              }`}>
                {labResult.status.charAt(0).toUpperCase() + labResult.status.slice(1)}
              </span>
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
              {labResult.results && labResult.results.length > 0 ? (
                labResult.results.map((item, index) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No test results available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Card className="p-4">
        <h2 className="text-base font-medium mb-3 pb-2 border-b">Notes & Recommendations</h2>
        <p className="text-sm text-gray-700">{labResult.notes || 'No notes available'}</p>
      </Card>
    </div>
  );
};

export default LabResultDetailPage;