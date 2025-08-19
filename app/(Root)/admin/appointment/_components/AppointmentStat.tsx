"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type AppointmentStatPRops = {
  title: string;
  period: string;
  action: string;
  appointmentStatus: appointmentStatus[];
};

type appointmentStatus = {
  label: string;
  count: string;
  color?: string
};

export const AppointmentStats = ({
  action,
  period,
  title,
  appointmentStatus
}: AppointmentStatPRops) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 space-y-2 sm:space-y-0">
        <div className="flex-1">
          <CardTitle className="text-base sm:text-lg font-medium text-gray-700">
            {title}
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">{period}</p>
        </div>
        <Button variant="outline" size="sm" className="w-full sm:w-auto touch-manipulation text-xs sm:text-sm">
          {action}
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mt-2">
          {appointmentStatus.map((s, i) => (
            <div key={i} className={cn("flex-1 border-b sm:border-b-0 sm:border-r last:border-0 pb-2 sm:pb-0")}>
              <p className="text-lg sm:text-xl font-semibold text-gray-700">{s.count}</p>
              <p className={`text-xs sm:text-sm ${ s.color}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
