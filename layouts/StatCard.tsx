import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
  bottom?: React.ReactNode;
};

export function StatCard({
  title,
  value,
  icon,
  className,
  bottom,
}: StatCardProps) {
  return (
    <Card className={`overflow-hidden ${className} shadow-sm border-0 touch-manipulation`}>
      <CardContent className="p-3 sm:p-6 space-y-2 sm:space-y-3">
        <div className="rounded-full p-2 sm:p-3 bg-[#E8F9FB] w-fit">{icon}</div>
        <div className="space-y-1 sm:space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold">{value}</h3>
          {bottom ? (
            bottom
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
