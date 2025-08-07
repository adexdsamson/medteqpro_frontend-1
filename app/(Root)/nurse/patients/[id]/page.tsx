"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Subheader from "@/app/(Root)/_components/Subheader";
import PersonalInformation from "./PersonalInformation";
import MedicalInfo from "./MedicalInfo";
import SocialInfo from "./SocialInfo";
import VitalSignsReport from "./VitalSignsReport";
import DiagnosticReport from "./DiagnosticReport";
import PrescriptionReport from "./PrescriptionReport";
import MedicalTest from "./MedicalTest";
import { usePatientDetailedInfo } from "@/features/services/patientService";
import { useToastHandler } from "@/hooks/useToaster";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const params = useParams();
  
  // Get patient ID from URL params
  const patientId = params.id as string;
  
  // Fetch patient details
  const { data: patient, isLoading, error } = usePatientDetailedInfo(patientId);
  const toast = useToastHandler();
  
  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error('Error', 'Failed to load patient details');
    }
  }, [error, toast]);

  const tabs: TabProps[] = [
    { key: "personalInformation", label: "Personal Information" },
    { key: "medicalInfo", label: "Medical Info" },
    { key: "socialInfo", label: "Social Info" },
    { key: "vitalSignsReport", label: "Vital Signs Report" },
    { key: "diagnosticReport", label: "Diagnostic Report" },
    { key: "prescriptionReport", label: "Prescription Report" },
    { key: "medicalTest", label: "Medical Test" },
  ];

  if (isLoading) {
    return (
      <>
        <Subheader title="Patients / Patient Information" />
        <div className="p-6 space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </>
    );
  }

  return (
    <>
      <Subheader title={`Patients / ${patient?.full_name || 'Patient Information'}`} />
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

        <Tabs defaultValue="personalInformation" className="w-full">
          <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
            {tabs.map((tabData) => (
              <TabsTrigger
                key={tabData.key}
                value={tabData.key}
                className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {tabData.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="personalInformation">
            <PersonalInformation patient={patient} />
          </TabsContent>
          <TabsContent value="medicalInfo">
            <MedicalInfo patient={patient} />
          </TabsContent>
          <TabsContent value="socialInfo">
            <SocialInfo patient={patient} />
          </TabsContent>
          <TabsContent value="vitalSignsReport">
            <VitalSignsReport patient={patient} />
          </TabsContent>
          <TabsContent value="diagnosticReport">
            <DiagnosticReport patient={patient} />
          </TabsContent>
          <TabsContent value="prescriptionReport">
            <PrescriptionReport patient={patient} />
          </TabsContent>
          <TabsContent value="medicalTest">
            <MedicalTest patient={patient} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
