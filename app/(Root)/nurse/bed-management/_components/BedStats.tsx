import React from "react";
import { Card } from "@/components/ui/card";

interface BedStatsProps {
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
}

export const BedStats: React.FC<BedStatsProps> = ({
  totalBeds,
  occupiedBeds,
  availableBeds,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Beds</p>
            <p className="text-2xl font-bold text-gray-900">{totalBeds}</p>
          </div>
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">T</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Occupied Beds</p>
            <p className="text-2xl font-bold text-red-600">{occupiedBeds}</p>
          </div>
          <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
            <span className="text-red-600 font-bold text-lg">O</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Available Beds</p>
            <p className="text-2xl font-bold text-green-600">{availableBeds}</p>
          </div>
          <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 font-bold text-lg">A</span>
          </div>
        </div>
      </Card>
    </div>
  );
};