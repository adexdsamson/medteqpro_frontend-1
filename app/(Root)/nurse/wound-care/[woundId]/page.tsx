'use client';

import { useParams } from 'next/navigation';
import Subheader from '../../../../../layouts/Subheader';
import WoundCareDetailPage from '../../../../../layouts/WoundCareDetailPage';

/**
 * Nurse module wound care detail page
 * Displays detailed information about a specific wound care record
 * @returns JSX.Element
 */
export default function NurseWoundCareDetailPage() {
  const params = useParams();
  const woundId = params.woundId as string;

  return (
    <>
      <Subheader title="Wound Care Details" />
      <WoundCareDetailPage woundRecordId={woundId} />
    </>
  );
}