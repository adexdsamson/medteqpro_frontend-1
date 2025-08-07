'use client';

import { Card, CardContent } from "@/components/ui/card";
import { LastSeenInfo } from "./types";

interface LastSeenCardGroupProps {
  lastSeenData?: LastSeenInfo[];
}

const defaultLastSeenData: LastSeenInfo[] = [
  {
    role: "Lab Sci",
    lastSeen: "02-05-2024 11:45AM",
    color: "bg-green-500"
  },
  {
    role: "Pharm",
    lastSeen: "02-05-2024 11:45AM",
    color: "bg-blue-500"
  },
  {
    role: "Nurse",
    lastSeen: "02-05-2024 11:45AM",
    color: "bg-gray-500"
  },
  {
    role: "Doctor",
    lastSeen: "02-05-2024 11:45AM",
    color: "bg-teal-500"
  }
];

export default function LastSeenCardGroup({ lastSeenData = defaultLastSeenData }: LastSeenCardGroupProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {lastSeenData.map((item, index) => (
        <Card key={index} className={`border border-gray-200 ${item.color}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-3">
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900 text-white">{item.role}</div>
                <div className="text-xs text-gray-500 mt-1 text-white">
                  Last Seen<br />
                  {item.lastSeen}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}