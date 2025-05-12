import React from "react";
import LabResultItem from "./LabResultItem";

const labResultsData = [
  {
    id: 1,
    patientId: "Patient-2234",
    testName: "Malaria",
    testType: "Internal",
    labScientist: "Queen Gabara",
    date: "20-Apr-2024",
  },
  {
    id: 2,
    patientId: "Patient-3409",
    testName: "Malaria",
    testType: "Internal",
    labScientist: "Queen Gabara",
    date: "18-Apr-2024",
  },
];

const LabResultsSection = () => {
  return (
    <div className="">
      <h2 className="text-base font-semibold mb-3">Recent Lab Result</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <div className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <div className="bg-gray-50 grid grid-cols-5 gap-4">
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient ID
            </div>
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test Name
            </div>
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test Type
            </div>
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lab Scientist
            </div>
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </div>
          </div>
          {/* Body */}
          <div className="bg-white divide-y divide-gray-200">
            {labResultsData.map((result) => (
              <LabResultItem
                key={result.id}
                patientId={result.patientId}
                testName={result.testName}
                testType={result.testType}
                labScientist={result.labScientist}
                date={result.date}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabResultsSection;