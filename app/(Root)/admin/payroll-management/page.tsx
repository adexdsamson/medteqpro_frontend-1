"use client";

import React, { useState } from "react";
import Subheader from "../../../../layouts/Subheader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeSummary from "./_components/EmployeeSummary";
import TaxesDeductions from "./_components/TaxesDeductions";
import PayDayCard from "./_components/PayDayCard";
import {
  PeriodPayment,
  TaxDeductionPayment,
} from "./_components/PaymentCategories";
// import { useToastHandlers } from "@/hooks/useToaster";

const PayrollManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("employee-summary");

  // Hooks
  // const handler = useToastHandlers();

  return (
    <>
      <Subheader
        title="Payroll Management"
      />

      <div className="p-6 space-y-6 min-h-screen w-full bg-gray-50">

        {/* Pay Day and Payment Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          {/* Pay Day Card */}
          <div className="lg:col-span-1">
            <PayDayCard />
          </div>

          {/* Payment Categories */}
          <div className="lg:col-span-3 gap-2 flex items-center">
            <PeriodPayment />
            <TaxDeductionPayment />
          </div>
        </div>

        {/* Tabs and Table */}
        <Card className="border rounded-md overflow-hidden">
          <CardContent className="p-0">
            <Tabs
              defaultValue="employee-summary"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b px-6 py-3">
                <TabsList className="bg-transparent p-0 h-auto w-auto gap-6">
                  <TabsTrigger
                    value="employee-summary"
                    className={`px-0 py-2 rounded-none border-b-2 ${
                      activeTab === "employee-summary"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent"
                    }`}
                  >
                    Employee Summary
                  </TabsTrigger>
                  <TabsTrigger
                    value="taxes-deductions"
                    className={`px-0 py-2 rounded-none border-b-2 ${
                      activeTab === "taxes-deductions"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent"
                    }`}
                  >
                    Taxes & Deductions
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="employee-summary" className="p-0">
                <EmployeeSummary />
              </TabsContent>

              <TabsContent value="taxes-deductions" className="p-0">
                <TaxesDeductions />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PayrollManagement;
