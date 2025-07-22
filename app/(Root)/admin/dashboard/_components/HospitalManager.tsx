import { Bed, Calendar, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Large } from "@/components/ui/Typography";
import { StatCard } from "@/app/(Root)/_components/StatCard";
import { HospitalAdminDashboardAnalytics } from "@/features/services/dashboardService";
import { Skeleton } from "@/components/ui/skeleton";

interface HospitalManagerProps {
  data?: HospitalAdminDashboardAnalytics;
  isLoading?: boolean;
}

const HospitalManager = ({ data, isLoading }: HospitalManagerProps) => {
  const occupiedBeds = data?.overview?.no_of_beds?.no_occupied || 0;
  const availableBeds = data?.overview?.no_of_beds?.no_available || 0;
  const totalBeds = data?.overview?.no_of_beds?.total || 0;
  const wards = data?.overview?.no_of_wards || 0;
  const rooms = data?.overview?.no_of_rooms || 0;
  const icus = data?.overview?.no_of_icus || 0;

  return (
    <div className="">
      <Large className="text-lg">Hospital Manager</Large>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-6 mt-2">
        {isLoading ? (
          <>
            <div className="bg-white p-4 rounded-lg shadow">
              <Skeleton className="h-6 w-6 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <Skeleton className="h-6 w-6 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <Skeleton className="h-6 w-6 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-12" />
            </div>
          </>
        ) : (
          <>
            <StatCard icon={<Bed className="h-6 w-6" />} value={wards} title="Wards" />
            <StatCard
              icon={<Hospital className="h-6 w-6" />}
              value={rooms}
              title="Rooms"
            />
            <StatCard
              icon={<Calendar className="h-6 w-6" />}
              value={icus}
              title="ICUs"
            />
          </>
        )}

        <div className="col-span-2 flex items-center justify-between bg-white px-4 shadow rounded-lg">
          {isLoading ? (
            <div className="flex items-center justify-between w-full py-6">
              <div className="ml-3">
                <Skeleton className="h-12 w-12 rounded-full mb-2" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex flex-col gap-5 justify-end items-center">
                <div className="flex items-center mr-6">
                  <div className="flex flex-col items-center mr-6">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <div className="h-8 w-px bg-gray-300 mx-2"></div>
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ) : (
            <>
              <div className="ml-3">
                <div className="rounded-full p-3 bg-blue-50 w-fit">
                  <Bed className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{totalBeds}</h3>
                  <p className="text-sm text-muted-foreground">Number of Beds</p>
                </div>
              </div>

              <div className="flex flex-col gap-5 justify-end items-center">
                <div className="flex items-center mr-6">
                  <div className="flex flex-col items-center mr-6">
                    <div className="text-sm text-gray-500">Occupied</div>
                    <div className="text-xl font-semibold text-red-500">
                      {occupiedBeds}
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-300 mx-2"></div>
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-500">Available</div>
                    <div className="text-xl font-semibold text-green-600">
                      {availableBeds}
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="bg-gray-100 hover:bg-gray-200">
                  Assign Bed
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalManager;
