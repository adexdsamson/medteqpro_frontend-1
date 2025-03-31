import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

type PieChartSegmentProps = {
  color: string;
  percentage: number;
  startAngle: number;
};

function PieChartSegment({ color, percentage, startAngle }: PieChartSegmentProps) {
  const endAngle = startAngle + (percentage * 360) / 100;
  
  // Convert angles to radians for calculations
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);
  
  // Calculate the SVG path
  const largeArcFlag = percentage > 50 ? 1 : 0;
  
  // Calculate points on the circle
  const x1 = 50 + 40 * Math.cos(startRad);
  const y1 = 50 + 40 * Math.sin(startRad);
  const x2 = 50 + 40 * Math.cos(endRad);
  const y2 = 50 + 40 * Math.sin(endRad);
  
  const pathData = [
    `M 50 50`,
    `L ${x1} ${y1}`,
    `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    'Z'
  ].join(' ');
  
  return <path d={pathData} fill={color} />;
}

type PieChartProps = {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
};

function PieChart({ data }: PieChartProps) {
  let startAngle = 0;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {data.map((segment, index) => {
        const percentage = (segment.value / total) * 100;
        const currentStartAngle = startAngle;
        startAngle += (percentage * 360) / 100;
        
        return (
          <PieChartSegment
            key={index}
            color={segment.color}
            percentage={percentage}
            startAngle={currentStartAngle}
          />
        );
      })}
      <circle cx="50" cy="50" r="25" fill="white" />
    </svg>
  );
}

type LegendItemProps = {
  color: string;
  name: string;
};

function LegendItem({ color, name }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm">{name}</span>
    </div>
  );
}

export function PatientStatistics() {
  const data = [
    { name: 'Greenlife', value: 25, color: '#008080' },
    { name: 'Medicare', value: 30, color: '#006666' },
    { name: 'George', value: 21, color: '#004C4C' },
    { name: 'Others', value: 24, color: '#4ECDC4' },
  ];
  
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col">
          <h3 className="font-semibold mb-2">Patients by Hospital</h3>
          <div className="text-4xl font-bold">10000</div>
          <div className="text-sm text-muted-foreground mb-4">Total Patient</div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-32 h-32">
              <PieChart data={data} />
            </div>
            <div className="flex flex-col gap-2">
              {data.map((item, index) => (
                <LegendItem key={index} color={item.color} name={item.name} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}