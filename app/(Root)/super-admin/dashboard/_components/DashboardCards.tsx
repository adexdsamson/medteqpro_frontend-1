'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, Building } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
  isLoading?: boolean;
};

export function StatCard({ title, value, icon, className, isLoading }: StatCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-2 px-4 space-y-2">
        <div className="rounded-full p-3 bg-blue-50 w-fit">
          {icon}
        </div>
        <div className='space-y-2'>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <h3 className="text-2xl font-bold">{value}</h3>
          )}
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardCardsProps {
  totalHospitals?: number;
  activeHospitals?: number;
  inactiveHospitals?: number;
  staffCount?: number;
  isLoading?: boolean;
}

export function DashboardCards({
  totalHospitals = 0,
  activeHospitals = 0,
  inactiveHospitals = 0,
  staffCount = 0,
  isLoading = false
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
      <StatCard 
        title="Hospitals" 
        value={totalHospitals} 
        icon={<Building className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />}
        isLoading={isLoading}
      />
      <StatCard 
        title="Active Hospitals" 
        value={activeHospitals} 
        icon={<Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />}
        isLoading={isLoading}
      />
      <StatCard 
        title="Inactive Hospitals" 
        value={inactiveHospitals} 
        icon={<Building className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />}
        isLoading={isLoading}
      />
      <StatCard 
        title="Our Staff" 
        value={staffCount} 
        icon={<Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />}
        isLoading={isLoading}
      />
    </div>
  );
}