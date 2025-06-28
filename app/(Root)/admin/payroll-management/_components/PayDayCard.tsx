import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const PayDayCard = () => {
  return (
    <Card className="h-full bg-transparent shadow-none">
      <CardContent className="flex flex-col items-center justify-center text-center space-y-2">
        <h3 className="text-gray-500 font-medium text-sm">Pay Day</h3>

        <div className="bg-white border rounded-lg p-2 w-full">
          <div className="text-4xl font-bold text-gray-900 mb-1">31</div>
          <div className="text-gray-600 text-sm">Jul, 2024</div>
        </div>

        <div className="text-sm text-gray-500 font-medium">200 Employees</div>
      </CardContent>
    </Card>
  );
};

export default PayDayCard;
