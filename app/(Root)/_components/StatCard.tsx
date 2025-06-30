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
    <Card className={`overflow-hidden ${className} shadow-sm border-0`}>
      <CardContent className=" space-y-2">
        <div className="rounded-full p-3 bg-[#E8F9FB] w-fit">{icon}</div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{value}</h3>
          {bottom ? (
            bottom
          ) : (
            <p className="text-sm text-muted-foreground">{title}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
