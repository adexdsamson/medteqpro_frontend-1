import React from 'react';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <Button className="bg-blue-800 hover:bg-blue-900">
          Register Hospital
        </Button>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-sm text-muted-foreground">Revenue</span>
        <span className="text-2xl font-bold">N35,233,879.00</span>
      </div>
    </div>
  );
}