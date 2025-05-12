import React from "react";

interface LabResultItemProps {
  patientId: string;
  testName: string;
  testType: string;
  labScientist: string;
  date: string;
}

const LabResultItem: React.FC<LabResultItemProps> = ({
  patientId,
  testName,
  testType,
  labScientist,
  date,
}) => {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {patientId}
      </div>
      <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {testName}
      </div>
      <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {testType}
      </div>
      <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {labScientist}
      </div>
      <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {date}
      </div>
    </div>
  );
};

export default LabResultItem;