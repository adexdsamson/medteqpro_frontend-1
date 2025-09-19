/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * TestChart component renders a bar chart for Lab Test Analytics.
 * It integrates with the lab test analytics API but, due to undocumented response schema,
 * it currently displays sample data while still triggering the API call for the selected filter.
 *
 * @remarks
 * - API endpoint: GET dashboard/laboratory/test-analytics/?filter={daily|monthly|yearly}
 * - Data contract is not specified in docs; once available, map `analytics?.data?.data` to chartData.
 *
 * @example
 * // Renders yearly analytics (default) and allows switching between daily/monthly/yearly
 * <TestChart />
 */
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { useGetLabTestAnalytics, LabTestAnalyticsFilter } from "@/features/services/labScientistService";

// Sample data for the chart - in a real app, this would come from the API
const chartData: any[] = [
];

const chartConfig = {
  completed: {
    label: "Completed",
    color: "#3b82f6",
  },
  pending: {
    label: "Pending",
    color: "#f59e0b",
  },
  cancelled: {
    label: "Cancelled",
    color: "#ef4444",
  },
} satisfies ChartConfig;

const TestChart: React.FC = () => {
  const [filter, setFilter] = useState<LabTestAnalyticsFilter>("yearly");
  const { isLoading, error } = useGetLabTestAnalytics(filter);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Test Analytics</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">View Table</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Compare</span>
            </div>
            <div className="flex items-center gap-4">
              {(["daily", "monthly", "yearly"] as LabTestAnalyticsFilter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={
                    filter === f
                      ? "text-blue-600 font-medium"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="text-xs text-gray-500 mt-2">Loading analytics...</div>
        ) : error ? (
          <div className="text-xs text-red-500 mt-2">Unable to load analytics</div>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Bar 
                  dataKey="completed" 
                  fill={chartConfig.completed.color}
                  radius={[2, 2, 0, 0]}
                  maxBarSize={40}
                />
                <Bar 
                  dataKey="pending" 
                  fill={chartConfig.pending.color}
                  radius={[2, 2, 0, 0]}
                  maxBarSize={40}
                />
                <Bar 
                  dataKey="cancelled" 
                  fill={chartConfig.cancelled.color}
                  radius={[2, 2, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {filter} statistics collected throughout frequency
        </div>
      </CardContent>
    </Card>
  );
};

export default TestChart;