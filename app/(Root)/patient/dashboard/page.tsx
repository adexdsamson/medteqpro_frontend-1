import React from "react";
import {
  WalletBalance,
  VitalsSection,
  AppointmentsSection,
  LabResultsSection,
} from "./_components";

function PatientDashboard() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <WalletBalance />
        </div>
      </div>

      <div className="space-y-6">
        <VitalsSection />
        
        <AppointmentsSection />
        
        <LabResultsSection />
      </div>
    </div>
  );
}

export default PatientDashboard; 