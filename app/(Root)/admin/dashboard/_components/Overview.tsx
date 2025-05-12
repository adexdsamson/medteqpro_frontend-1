import { Building } from "lucide-react";
import { Large, P } from "@/components/ui/Typography";
import { StatCard } from "../../../_components/StatCard";

const Overview = () => {
  return (
    <div>
      <Large className="text-lg">Overview</Large>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-2">
        <StatCard
          title="Our Patients"
          value={29801}
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
          value={56}
          icon={<Building className="h-5 w-5 text-blue-500" />}
        />
        <StatCard
          title="Our Staff"
          value={298}
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
          value={102}
          icon={<Building className="h-5 w-5 text-blue-500" />}
        />
        <StatCard
          title="Upcoming Appointment"
          value={4}
          icon={<Building className="h-5 w-5 text-blue-500" />}
        />
      </div>
    </div>
  );
};

export default Overview; 