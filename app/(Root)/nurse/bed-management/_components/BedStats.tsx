import React from "react";

interface BedStatsProps {
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
}

export const BedStats: React.FC<BedStatsProps> = ({
  totalBeds,
  availableBeds,
  occupiedBeds,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
      <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-cyan-50 border border-cyan-200 rounded-md touch-manipulation">
        <div className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0"></div>
        <span className="text-xs sm:text-xs font-medium text-gray-700 whitespace-nowrap">Total Beds</span>
        <span className="bg-cyan-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center ml-auto sm:ml-0">
          {totalBeds}
        </span>
      </div>

      <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-md touch-manipulation">
        <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
        <span className="text-xs sm:text-xs font-medium text-gray-700 whitespace-nowrap">Available</span>
        <span className="bg-teal-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center ml-auto sm:ml-0">
          {availableBeds}
        </span>
      </div>

      <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-md touch-manipulation">
        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
        <span className="text-xs sm:text-xs font-medium text-gray-700 whitespace-nowrap">Occupied</span>
        <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center ml-auto sm:ml-0">
          {occupiedBeds}
        </span>
      </div>
    </div>
  );
};