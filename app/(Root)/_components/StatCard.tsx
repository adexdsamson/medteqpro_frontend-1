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
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className=" space-y-2">
        <div className="rounded-full p-3 bg-blue-50 w-fit">{icon}</div>
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
