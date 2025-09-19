'use client';

import { Card, CardContent } from "@/components/ui/card";

interface PatientStatusCardProps {
  status?: string;
  statusColor?: string;
}

export default function PatientStatusCard({ 
  status = "Okay to Attend", 
  statusColor = "bg-green-500" 
}: PatientStatusCardProps) {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Payment Status</div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${statusColor}`}>
          {status}
        </div>
      </CardContent>
    </Card>
  );
}