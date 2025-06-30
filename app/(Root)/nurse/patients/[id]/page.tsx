"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Subheader from "@/app/(Root)/_components/Subheader";
import PersonalInformation from "./PersonalInformation";
import MedicalInfo from "./MedicalInfo";
import SocialInfo from "./SocialInfo";
import VitalSignsReport from "./VitalSignsReport";
import DiagnosticReport from "./DiagnosticReport";
import PrescriptionReport from "./PrescriptionReport";
import MedicalTest from "./MedicalTest";

type TabType =
  | "personalInformation"
  | "medicalInfo"
  | "socialInfo"
  | "vitalSignsReport"
  | "diagnosticReport"
  | "prescriptionReport"
  | "medicalTest";

type TabProps = { key: TabType; label: string };

export default function PatientDetailPage() {
  const [tab, setTab] = useState<TabType>("personalInformation");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  useEffect(() => {
    router.push(`${pathname}?section=${tab}`);
  }, [tab, pathname, router]);

  useEffect(() => {
    if (section) {
      setTab(section as TabType);
    }
  }, [section]);

  const tabs: TabProps[] = [
    { key: "personalInformation", label: "Personal Information" },
    { key: "medicalInfo", label: "Medical Info" },
    { key: "socialInfo", label: "Social Info" },
    { key: "vitalSignsReport", label: "Vital Signs Report" },
    { key: "diagnosticReport", label: "Diagnostic Report" },
    { key: "prescriptionReport", label: "Prescription Report" },
    { key: "medicalTest", label: "Medical Test" },
  ];

  return (
    <>
      <Subheader title="Patients / Patient Information" />
      <div className="p-6 space-y-6">
        <div className=" rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-md text-center bg-[#7EB800]  px-4 py-2 ">
                <p className="text-sm font-medium text-white mb-2">Lab Sci.</p>
                <p className="text-xs text-white">Last Seen </p>
                <span className="text-xs text-white"> 02-05-2024 11:44AM</span>
              </div>
              <div className=" rounded-md text-center gap-3  bg-[#118795] py-2 px-4 border-r">
                <p className="text-sm font-medium text-white mb-2">Pharm.</p>

                <p className="text-xs text-white">Last Seen </p>
                <span className="text-xs text-white"> 02-05-2024 11:44AM</span>
              </div>
              <div className="text-center px-4 py-2 bg-[#968279] rounded-md">
                <p className="text-sm font-medium mb-2 text-white">Nurse</p>
                <p className="text-xs text-white">Last Seen </p>
                <span className="text-xs text-white">02-05-2024 11:44AM</span>
              </div>
              <div className="text-center  px-4 py-2 bg-[#609B9E] rounded-md">
                <p className="text-sm font-medium  text-white mb-2">Doctor</p>
                <p className="text-xs text-white">Last Seen </p>
                <span className="text-xs text-white"> 02-05-2024 11:44AM</span>
              </div>
            </div>
            <div className="rounded-md bg-white border">
              <div className="w-full bg-[#84CC16] p-2 rounded-t-md text-center">
                <span className=" text-center text-xs  text-white">
                  Payment Status
                </span>
              </div>
              <div className="flex items-center p-4">
                <span className="text-sm font-medium ">Okay to Attend</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-b">
          {tabs.map((tabData) => (
            <div
              key={tabData.key}
              onClick={() => setTab(tabData.key)}
              className={`px-4 py-2 cursor-pointer text-xs font-medium border-b-2 transition-colors ${
                tab === tabData.key
                  ? "border-[#118795] text-[#118795]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tabData.label}
            </div>
          ))}
        </div>

        {tab === "personalInformation" && <PersonalInformation />}
        {tab === "medicalInfo" && <MedicalInfo />}
        {tab === "socialInfo" && <SocialInfo />}
        {tab === "vitalSignsReport" && <VitalSignsReport />}
        {tab === "diagnosticReport" && <DiagnosticReport />}
        {tab === "prescriptionReport" && <PrescriptionReport />}
        {tab === "medicalTest" && <MedicalTest />}
      </div>
    </>
  );
}
