import React from "react";

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
    <div>
      <h2 className="text-base font-semibold mb-3">Recent Lab Result</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
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
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {labResultsData.map((result) => (
              <tr key={result.id}>
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
    </div>
  );
};

export default LabResultsSection; 