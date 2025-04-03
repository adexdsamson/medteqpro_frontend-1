import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, Building } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
};

export function StatCard({ title, value, icon, className }: StatCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p- space-y-2">
        <div className="rounded-full p-3 bg-blue-50 w-fit">
          {icon}
        </div>
        <div className='space-y-2'>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Hospitals" 
        value={52} 
        icon={<Building className="h-5 w-5 text-blue-500" />} 
      />
      <StatCard 
        title="Active Hospitals" 
        value={35} 
        icon={<Building2 className="h-5 w-5 text-green-500" />} 
      />
      <StatCard 
        title="Inactive Hospitals" 
        value={27} 
        icon={<Building className="h-5 w-5 text-red-500" />} 
      />
      <StatCard 
        title="Our Staff" 
        value={20} 
        icon={<Users className="h-5 w-5 text-purple-500" />} 
      />
    </div>
  );
}