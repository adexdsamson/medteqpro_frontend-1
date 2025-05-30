import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentCategoryProps {
  label: string;
  amount: string;
  className?: string;
}

const PaymentCategory: React.FC<PaymentCategoryProps> = ({ label, amount, className }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-gray-500 text-sm mb-1">{label}</span>
      <span className="text-gray-800 font-semibold">{amount}</span>
    </div>
  );
};

export const PeriodPayment = () => {
  // Period dates
  const periodStart = "01-Jul-2024";
  const periodEnd = "31-Jul-2024";
  
  return (
    <Card className="border shadow-sm w-full">
      <CardContent className="">
        <div className="flex justify-center items-center mb-6">
          <span className="text-gray-700 font-medium">Period:{" "}{" "}</span>
          <span className="text-gray-700 ml-2">{periodStart} - {periodEnd}</span>
        </div>
        
        <div className="flex items-center justify-between w-full">
          <PaymentCategory 
            label="Payroll Cost" 
            amount="₦10,234,678.99" 
          />
          
          <PaymentCategory 
            label="Employee Net Pay" 
            amount="₦8,034,678.99" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export const TaxDeductionPayment = () => {
  return (
    <Card className="border shadow-sm w-full">
      <CardContent className="">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-700 font-medium text-center">Tax & Deductions Summary</span>
        </div>
         
        <div className="flex items-center justify-between flex-1">          
          <PaymentCategory 
            label="Tax Withholdings" 
            amount="₦1,234,678.99" 
          />
          
          <PaymentCategory 
            label="Pre-Tax Deductions" 
            amount="₦834,678.99" 
          />
        </div>
      </CardContent>
    </Card>
  )
}