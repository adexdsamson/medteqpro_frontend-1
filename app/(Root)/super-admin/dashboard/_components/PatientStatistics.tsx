"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type PieChartSegmentProps = {
  color: string;
  percentage: number;
  startAngle: number;
};

function PieChartSegment({
  color,
  percentage,
  startAngle,
}: PieChartSegmentProps) {
  const endAngle = startAngle + (percentage * 360) / 100;

  // Convert angles to radians for calculations
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);

  // Calculate the SVG path
  const largeArcFlag = percentage > 50 ? 1 : 0;

  // Calculate points on the circle
  const x1 = 50 + 40 * Math.cos(startRad);
  const y1 = 50 + 40 * Math.sin(startRad);
  const x2 = 50 + 40 * Math.cos(endRad);
  const y2 = 50 + 40 * Math.sin(endRad);

  const pathData = [
    `M 50 50`,
    `L ${x1} ${y1}`,
    `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    "Z",
  ].join(" ");

  return <path d={pathData} fill={color} />;
}

type PieChartProps = {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
};

function PieChart({ data }: PieChartProps) {
  let startAngle = 0;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {data.map((segment, index) => {
        const percentage = (segment.value / total) * 100;
        const currentStartAngle = startAngle;
        startAngle += (percentage * 360) / 100;

        return (
          <PieChartSegment
            key={index}
            color={segment.color}
            percentage={percentage}
            startAngle={currentStartAngle}
          />
        );
      })}
      <circle cx="50" cy="50" r="25" fill="white" />
    </svg>
  );
}

type LegendItemProps = {
  color: string;
  name: string;
};

function LegendItem({ color, name }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm">{name}</span>
    </div>
  );
}

type HospitalPatientData = {
  name: string;
  value: number;
  color: string;
};

interface PatientStatisticsProps {
  patientsByHospital?: HospitalPatientData[];
  totalPatients?: number;
  isLoading?: boolean;
  // Add new props to match what's being passed in page.tsx
  topHospitals?: { name: string; percentage_of_total_patients: number }[];
  otherHospitals?: { name: string; percentage_of_total_patients: number };
}

export function PatientStatistics({
  patientsByHospital,
  totalPatients = 0,
  isLoading = false,
  topHospitals,
  otherHospitals,
}: PatientStatisticsProps) {
  // Transform the topHospitals and otherHospitals data into the format expected by PieChart
  const data = React.useMemo(() => {
    if (topHospitals) {
      // Define colors for the top hospitals
      const colors = ["#008080", "#006666", "#004C4C"];

      // Map topHospitals to the format needed by PieChart
      const topHospitalsData = topHospitals.map((hospital, index) => ({
        name: hospital.name,
        value: hospital.percentage_of_total_patients,
        color: colors[index % colors.length],
      }));

      // Add otherHospitals if it exists
      if (otherHospitals) {
        return [
          ...topHospitalsData,
          {
            name: "Others",
            value: otherHospitals.percentage_of_total_patients,
            color: "#4ECDC4",
          },
        ];
      }

      return topHospitalsData;
    }

    // Fall back to patientsByHospital or default data
    return patientsByHospital || [];
  }, [topHospitals, otherHospitals, patientsByHospital]);

  // Calculate total patients from the data if totalPatients is not provided
  const displayTotalPatients = React.useMemo(() => {
    if (totalPatients > 0) return totalPatients;

    // If we have topHospitals data, we can calculate the total
    if (topHospitals) {
      const total = topHospitals.reduce(
        (sum, hospital) => sum + hospital.percentage_of_total_patients,
        0
      );
      if (otherHospitals) {
        return total + otherHospitals.percentage_of_total_patients;
      }
      return total;
    }

    return data.reduce((sum, item) => sum + item.value, 0);
  }, [totalPatients, topHospitals, otherHospitals, data]);

  return (
    <Card className="bg-white">
      <CardContent className="">
        <div className="flex flex-col">
          <div className="border-b border-gray-300">
            <h3 className="font-semibold mb-2 text-sm text-gray-900">
              Patients by Hospital
            </h3>
          </div>

          <div className="py-3 border-b border-gray-300">
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-[#118795]">
                {displayTotalPatients.toLocaleString()}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Total Patient</div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 py-3 items-center">
            {isLoading ? (
              <div className="w-32 h-32 flex items-center justify-center">
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
            ) : (
              <div className="w-32 h-32">
                <PieChart data={data} />
              </div>
            )}
            <div className="flex flex-col gap-2">
              {isLoading
                ? Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))
                : data.map((item, index) => (
                    <LegendItem
                      key={index}
                      color={item.color}
                      name={item.name}
                    />
                  ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
