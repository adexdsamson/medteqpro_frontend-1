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

const PaymentCategories = () => {
  // Period dates
  const periodStart = "01-Jul-2024";
  const periodEnd = "31-Jul-2024";
  
  return (
    <Card className="border shadow-sm h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-700 font-medium">Period:</span>
          <span className="text-gray-700">{periodStart} - {periodEnd}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <PaymentCategory 
            label="Payroll Cost" 
            amount="₦10,234,678.99" 
          />
          
          <PaymentCategory 
            label="Employee Net Pay" 
            amount="₦8,034,678.99" 
          />
          
          <PaymentCategory 
            label="Tax Withholdings" 
            amount="₦10,234,678.99" 
          />
          
          <PaymentCategory 
            label="Pre-Tax Deductions" 
            amount="₦8,034,678.99" 
          />
          
          <PaymentCategory 
            label="Post-Tax Deductions" 
            amount="₦1,970,678.99" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentCategories;