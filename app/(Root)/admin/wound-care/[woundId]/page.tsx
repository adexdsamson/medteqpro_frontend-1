"use client";

import { useParams } from "next/navigation";
import Subheader from "../../../../../layouts/Subheader";
import WoundCareDetailPage from "../../../../../layouts/WoundCareDetailPage";

/**
 * Admin Wound Care Detail Page
 * Displays detailed wound care information for administrative oversight
 * @returns JSX.Element
 */
const AdminWoundCareDetail = () => {
  const params = useParams();
  const woundId = params.woundId as string;

  return (
    <>
      <Subheader title="Wound Care Details" />
      <WoundCareDetailPage woundRecordId={woundId} />
    </>
  );
};

export default AdminWoundCareDetail;