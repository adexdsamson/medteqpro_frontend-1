"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Hourglass, XCircle } from "lucide-react";

export type StatBoxProps = {
  title: string;
  value: number;
  tone: "success" | "warning" | "danger";
};

/**
 * Small stat box used in the Pickup overview section.
 * Follows the visual cues in the provided design with tinted icon backgrounds and bold numbers.
 * @param props
 */
export function StatBox({ title, value, tone }: StatBoxProps) {
  const map = {
    success: {
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      bg: "bg-green-50",
    },
    warning: {
      icon: <Hourglass className="h-5 w-5 text-yellow-500" />,
      bg: "bg-yellow-50",
    },
    danger: {
      icon: <XCircle className="h-5 w-5 text-rose-500" />,
      bg: "bg-rose-50",
    },
  } as const;

  const s = map[tone];

  return (
    <Card className="shadow-sm border-0">
      <CardContent className="p-4 space-y-2">
        <div className={`w-fit p-2 rounded-full ${s.bg}`}>{s.icon}</div>
        <div>
          <div className="text-3xl font-bold">{value.toLocaleString()}</div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </CardContent>
    </Card>
  );
}