"use client";

import { useParams } from "next/navigation";
import Subheader from "../../../../../layouts/Subheader";
import WoundCareDetailPage from "@/layouts/WoundCareDetailPage";

export default function DoctorWoundCareDetailPage() {
  const params = useParams();
  const woundId = params.woundId as string;

  return (
    <>
      <Subheader title="Wound Care / Detail" />
      <div className="min-h-screen bg-gray-50">
        <WoundCareDetailPage woundRecordId={woundId} />
      </div>
    </>
  );
}