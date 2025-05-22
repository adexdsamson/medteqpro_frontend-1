import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const PayDayCard = () => {
  return (
    <Card className="bg-white border shadow-sm">
      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
        <h3 className="text-gray-500 font-medium mb-2">Pay Day</h3>
        
        <div className="text-5xl font-bold mb-1">31</div>
        <div className="text-gray-600 mb-4">Jul, 2024</div>
        
        <div className="text-sm text-gray-500 font-medium">
          200 Employees
        </div>
      </CardContent>
    </Card>
  );
};

export default PayDayCard;