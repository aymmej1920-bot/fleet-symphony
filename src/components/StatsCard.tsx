import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "destructive";
  trend?: {
    value: number;
    label: string;
  };
}

export const StatsCard = ({ title, value, icon: Icon, variant = "default", trend }: StatsCardProps) => {
  const variantClasses = {
    default: "gradient-primary text-primary-foreground",
    success: "gradient-accent text-success-foreground",
    warning: "gradient-warning text-warning-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
      <div className={`p-6 ${variantClasses[variant]}`}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium opacity-90">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs opacity-75">
                <span className={trend.value >= 0 ? "text-green-200" : "text-red-200"}>
                  {trend.value >= 0 ? "+" : ""}{trend.value}%
                </span>{" "}
                {trend.label}
              </p>
            )}
          </div>
          <div className="rounded-full bg-white/20 p-3">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </Card>
  );
};
