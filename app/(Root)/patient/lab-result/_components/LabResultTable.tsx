"use client";

import React from "react";

// Sample lab results data
const labResults = [
  {
    id: 1,
    patientId: "Patient-2234",
    testName: "Malaria",
    testType: "Internal",
    labScientist: "Queen Gabara",
    date: "22-May-24"
  },
  {
    id: 2,
    patientId: "Patient-3409",
    testName: "Malaria",
    testType: "Internal",
    labScientist: "Queen Gabara",
    date: "22-May-24"
  },
  {
    id: 3,
    patientId: "Patient-2234",
    testName: "Cough",
    testType: "Internal",
    labScientist: "Queen Gabara", 
    date: "22-May-24"
  },
  {
    id: 4,
    patientId: "Patient-3409",
    testName: "Cough",
    testType: "Internal",
    labScientist: "Queen Gabara",
    date: "22-May-24"
  }
];

const LabResultTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Patient ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Test Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Test Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Lab Scientist
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Test Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {labResults.map((result) => (
            <tr 
              key={result.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => window.open(`/patient/lab-result/${result.id}`, "_self")}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {result.patientId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {result.testName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {result.testType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {result.labScientist}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {result.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LabResultTable; 