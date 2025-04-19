import React from "react";

const NurseDashboard = () => {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Patient Vitals</h2>
          <p className="text-gray-500">4 vitals records pending</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Medication Schedule</h2>
          <p className="text-gray-500">8 medications due in the next hour</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Ward Status</h2>
          <p className="text-gray-500">12 patients currently admitted</p>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Patient Care Tasks</h2>
        <p className="text-gray-500">Task list will be displayed here</p>
      </div>
    </div>
  );
};

export default NurseDashboard; 