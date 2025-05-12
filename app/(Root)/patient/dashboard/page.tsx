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
      <div className="p-6 lg:max-w-7xl mx-auto h-full">
        <div className="flex justify-end gap-6 mb-8">
          <WalletBalance />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-fit px-2 mb-4">
          <div className="w-full h-full pb-2">
            <VitalsSection />
          </div>
          <div className="w-full h-full">
            <AppointmentsSection />
          </div>
        </div>

        <LabResultsSection />
      </div>
    </>
  );
}

export default PatientDashboard;
