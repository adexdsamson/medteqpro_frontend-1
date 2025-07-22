import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TestTube, Clock, XCircle, Calendar, Users } from "lucide-react";
import { LabDashboardAnalytics } from "@/features/services/labScientistService";

interface StatsCardsProps {
  data?: LabDashboardAnalytics;
}

const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  const stats = [
    {
      title: "Completed Test",
      value: data?.completed_tests || 0,
      icon: TestTube,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Test",
      value: data?.pending_tests || 0,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Cancelled Test",
      value: data?.cancelled_tests || 0,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Due Test",
      value: data?.due_tests || 0,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Upcoming Appointment",
      value: data?.upcoming_appointments || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;