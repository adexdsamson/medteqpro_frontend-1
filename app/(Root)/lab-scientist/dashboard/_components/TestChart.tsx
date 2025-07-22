import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";

// Sample data for the chart - in a real app, this would come from the API
const chartData = [
  { month: "Jan", completed: 180, pending: 120, cancelled: 40 },
  { month: "Feb", completed: 200, pending: 150, cancelled: 30 },
  { month: "Mar", completed: 220, pending: 180, cancelled: 50 },
  { month: "Apr", completed: 280, pending: 200, cancelled: 60 },
  { month: "May", completed: 320, pending: 220, cancelled: 45 },
  { month: "Jun", completed: 350, pending: 250, cancelled: 55 },
  { month: "Jul", completed: 380, pending: 280, cancelled: 40 },
  { month: "Aug", completed: 400, pending: 300, cancelled: 65 },
  { month: "Sep", completed: 420, pending: 320, cancelled: 50 },
  { month: "Oct", completed: 450, pending: 350, cancelled: 70 },
  { month: "Nov", completed: 480, pending: 380, cancelled: 45 },
  { month: "Dec", completed: 500, pending: 400, cancelled: 60 },
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
              <span className="text-gray-600">Daily</span>
              <span className="text-gray-600">Monthly</span>
              <span className="text-blue-600 font-medium">Yearly</span>
            </div>
          </div>
        </div>
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
          Showing monthly statistics collected throughout frequency
        </div>
      </CardContent>
    </Card>
  );
};

export default TestChart;