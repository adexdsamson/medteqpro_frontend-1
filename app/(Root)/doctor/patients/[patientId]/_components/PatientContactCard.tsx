'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Phone } from "lucide-react";

interface PatientContactCardProps {
  name: string;
  phone: string;
}

export default function PatientContactCard({ name, phone }: PatientContactCardProps) {

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="text-sm font-medium text-gray-700 mb-3">Patient Contact</div>
        <div className="space-y-3">
          <div className="text-lg font-semibold text-gray-900">
            {name}
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Phone className="h-4 w-4" />
            <span className="text-sm font-medium">{phone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}