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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium text-gray-700">
            {title}
          </CardTitle>
          <p className="text-xs text-gray-500">{period}</p>
        </div>
        <Button variant="outline" size="sm">
          {action}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mt-2">
          {appointmentStatus.map((s, i) => (
            <div key={i} className={cn("flex-1 border-r last:border-0")}>
              <p className="text-xl font-semibold text-gray-700">{s.count}</p>
              <p className={`text-xs ${ s.color}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};