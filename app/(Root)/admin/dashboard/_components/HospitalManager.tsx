import { Bed, Calendar, Home, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";
import { H2, Large } from "@/components/ui/Typography";
import { StatCard } from "@/app/(Root)/_components/StatCard";

const HospitalManager = () => {
  const occupiedBeds = 200;
  const availableBeds = 96;

  return (
    <div className="">
      <Large className="text-lg">Hospital Manager</Large>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-6 mt-2">
        <StatCard icon={<Bed className="h-6 w-6" />} value={2} title="Wards" />

        <StatCard
          icon={<Hospital className="h-6 w-6" />}
          value={110}
          title="Rooms"
        />

        <StatCard
          icon={<Calendar className="h-6 w-6" />}
          value={7}
          title="ICUs"
        />

        <div className="col-span-2 flex items-center justify-between bg-white px-4 shadow rounded-lg">
          <div className="ml-3">
            <div className="rounded-full p-3 bg-blue-50 w-fit">
              <Bed className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">298</h3>
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
        </div>
      </div>
    </div>
  );
};

export default HospitalManager;
