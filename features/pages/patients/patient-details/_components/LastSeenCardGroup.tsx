'use client';

import { Card, CardContent } from "@/components/ui/card";
import { LastSeenInfo } from "./types";

interface LastSeenCardGroupProps {
  lastSeenData?: LastSeenInfo;
}


export default function LastSeenCardGroup({ lastSeenData }: LastSeenCardGroupProps) {
  const defaultLastSeenData = [
    {
      role: "Lab Sci",
      lastSeen: lastSeenData?.lab_scientist,
      color: "bg-green-500"
    },
    {
      role: "Pharm",
      lastSeen: lastSeenData?.pharmacist,
      color: "bg-blue-500"
    },
    {
      role: "Nurse",
      lastSeen: lastSeenData?.nurse,
      color: "bg-gray-500"
    },
    {
      role: "Doctor",
      lastSeen: lastSeenData?.doctor,
      color: "bg-teal-500"
    }
  ];
  
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {defaultLastSeenData.map((item, index) => (
        <Card key={index} className={`border border-gray-200 ${item.color}`}>
          <CardContent className="p-1">
            <div className="flex items-center justify-center gap-3">
              <div className="text-center">
                <div className="text-lg font-medium text-white">{item.role}</div>
                <div className="text-xs mt-1 text-white">
                  Last Seen<br />
                  {item.lastSeen ?? "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}