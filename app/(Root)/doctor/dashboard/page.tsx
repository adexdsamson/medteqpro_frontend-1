import React from "react";

const DoctorDashboard = () => {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Upcoming Appointments</h2>
          <p className="text-gray-500">You have 5 appointments today</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Patient Statistics</h2>
          <p className="text-gray-500">12 patients seen this week</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Tasks</h2>
          <p className="text-gray-500">3 pending reports to complete</p>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Patients</h2>
        <p className="text-gray-500">Patient list will be displayed here</p>
      </div>
    </div>
  );
};

export default DoctorDashboard; 