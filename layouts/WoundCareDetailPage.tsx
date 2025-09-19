'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, 
  Activity, 
  Edit,
  Calendar,
  Stethoscope,
} from 'lucide-react';
import { formatDate } from "@/features/services/labScientistService";
import { useWoundRecord } from '@/features/services/woundCareService';
import EditWoundRecordDialog from '@/app/(Root)/doctor/wound-care/_components/EditWoundRecordDialog';

interface WoundCareDetailPageProps {
  woundRecordId: string;
}

const WoundCareDetailPage: React.FC<WoundCareDetailPageProps> = ({
  woundRecordId
}) => {
  const { data: woundRecord, isLoading, error } = useWoundRecord(woundRecordId);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-56 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading wound record: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!woundRecord) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-600">
              Wound record not found
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wound Care Detail</h1>
          <p className="text-gray-600 mt-1">Patient: {woundRecord.patient_fullname}</p>
        </div>
        <EditWoundRecordDialog id={woundRecordId}>
          <Button className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Record
          </Button>
        </EditWoundRecordDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Patient Name</label>
                  <p className="text-gray-900">{woundRecord.patient_fullname}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Patient ID</label>
                  <p className="text-gray-900">{woundRecord.patient.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-gray-900">{woundRecord.patient.date_of_birth ? formatDate(woundRecord.patient.date_of_birth) : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-gray-900">{woundRecord.patient.gender || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>



          {/* Wound Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Wound Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Wound Type</label>
                  <p className="text-gray-900">{woundRecord.wound_condition_overall || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900">{woundRecord.description_tags?.join(', ') || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Size (mm)</label>
                  <p className="text-gray-900">{woundRecord.size_in_mm || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Depth</label>
                  <p className="text-gray-900">{woundRecord.depth || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Exudate Amount</label>
                  <p className="text-gray-900">{woundRecord.exudate_amount || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Odour</label>
                  <p className="text-gray-900">{woundRecord.odour || 'N/A'}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <label className="text-sm font-medium text-gray-500">Wound Bed Assessment</label>
                <p className="text-gray-900 mt-1">{woundRecord.wound_bed_assessment || 'No assessment available'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Treatment Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Treatment Plan</label>
                  <p className="text-gray-900">{woundRecord.treatment_plan || 'No treatment plan available'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Dressing Type</label>
                  <p className="text-gray-900">{woundRecord.dressing_type || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Dressing Frequency</label>
                  <p className="text-gray-900">{woundRecord.dressing_frequency || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Previous Treatment</label>
                  <p className="text-gray-900">{woundRecord.previous_treatment || 'No previous treatment recorded'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Follow-up */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Follow-up
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Follow-up Required</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    woundRecord.follow_up_needed ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {woundRecord.follow_up_needed ? 'Yes' : 'No'}
                  </span>
                </div>
                {woundRecord.follow_up_needed && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Follow-up Date</label>
                    <p className="text-gray-900">{woundRecord.follow_up_date ? formatDate(woundRecord.follow_up_date) : 'Not scheduled'}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Follow-up Notes</label>
                  <p className="text-gray-900">{woundRecord.follow_up_notes || 'No follow-up notes available'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WoundCareDetailPage;