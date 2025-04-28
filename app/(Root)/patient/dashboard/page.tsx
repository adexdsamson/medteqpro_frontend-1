import React from "react";
import {
  WalletBalance,
  VitalsSection,
  AppointmentsSection,
  LabResultsSection,
} from "./_components";
import Subheader from "../../_components/Subheader";

function PatientDashboard() {
  return (
    <>
      <Subheader title="Dashboard" />
      <div className="p-6 space-y-6 min-h-screen">
        <div className="flex justify-end gap-6">
          <WalletBalance />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full">
            <VitalsSection />
          </div>
          <div className="w-full">
            <AppointmentsSection />
          </div>
        </div>

        <LabResultsSection />
      </div>
    </>
  );
}

export default PatientDashboard;
