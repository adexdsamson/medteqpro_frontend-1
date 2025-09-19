import { Building } from "lucide-react";
import { Large, P } from "@/components/ui/Typography";
import { StatCard } from "../../../../../layouts/StatCard";
import { HospitalAdminDashboardAnalytics } from "@/features/services/dashboardService";
import { Skeleton } from "@/components/ui/skeleton";

interface OverviewProps {
  data?: HospitalAdminDashboardAnalytics;
  isLoading?: boolean;
}

const Overview = ({ data, isLoading }: OverviewProps) => {
  return (
    <div>
      <Large className="text-lg">Overview</Large>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Our Patients"
              value={data?.overview?.total_no_of_patients || 0}
              icon={<Building className="h-5 w-5 text-blue-500" />}
              bottom={
                <div className="text-sm text-muted-foreground flex items-center gap-2 justify-between">
                  <P>Our Patients</P>
                  <button className="px-2.5 py-1.5 rounded-md bg-gray-200 ">View All</button>
                </div>
              }
            />
            <StatCard
              title="Our Doctors"
              value={data?.overview?.total_no_of_doctors || 0}
              icon={<Building className="h-5 w-5 text-blue-500" />}
            />
            <StatCard
              title="Our Staff"
              value={data?.overview?.total_no_of_staff || 0}
              icon={<Building className="h-5 w-5 text-blue-500" />}
              bottom={
                <div className="text-sm text-muted-foreground flex items-center gap-2 justify-between">
                  <P>Our Staff</P>
                  <button className="px-2.5 py-1.5 rounded-md bg-gray-200 ">View All</button>
                </div>
              }
            />
            <StatCard
              title="Medicine"
              value={data?.overview?.no_of_medicines || 0}
              icon={<Building className="h-5 w-5 text-blue-500" />}
            />
            <StatCard
              title="Upcoming Appointment"
              value={data?.overview?.no_of_upcoming_appointments || 0}
              icon={<Building className="h-5 w-5 text-blue-500" />}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Overview;