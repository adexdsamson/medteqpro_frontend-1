import { Card, CardContent } from "@/components/ui/card";
import { Small } from "@/components/ui/Typography";

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
    <Card className={`overflow-hidden ${className} shadow-sm border-0 touch-manipulation py-0`}>
      <CardContent className="p-3 px-6 space-y-2">
        <div className="rounded-full p-2 bg-[#E8F9FB] w-fit">{icon}</div>
        <div className="space-y-1 sm:space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold">{value}</h3>
          {bottom ? (
            bottom
          ) : (
            <Small className="text-xs text-muted-foreground">{title}</Small>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
