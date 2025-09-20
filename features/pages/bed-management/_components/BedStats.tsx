import React from "react";

interface BedStatsProps {
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
}

/**
 * Displays aggregate bed statistics (total, available, occupied)
 * @param props - Bed statistics
 * @returns React.ReactElement
 * @example
 * <BedStats totalBeds={10} availableBeds={6} occupiedBeds={4} />
 */
export const BedStats: React.FC<BedStatsProps> = ({
  totalBeds,
  availableBeds,
  occupiedBeds,
}) => {
  return (
    <div className="flex gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 border border-cyan-200 rounded-md">
        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
        <span className="text-xs font-medium text-gray-700">Total Beds</span>
        <span className="bg-cyan-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center">
          {totalBeds}
        </span>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-md">
        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
        <span className="text-xs font-medium text-gray-700">Available</span>
        <span className="bg-teal-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center">
          {availableBeds}
        </span>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-md">
        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
        <span className="text-xs font-medium text-gray-700">Occupied</span>
        <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center">
          {occupiedBeds}
        </span>
      </div>
    </div>
  );
};