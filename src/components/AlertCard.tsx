import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

interface AlertCardProps {
  alert: {
    id: string;
    type: "critical" | "warning" | "info" | "success";
    title: string;
    description: string;
    timestamp: string;
  };
}

export const AlertCard = ({ alert }: AlertCardProps) => {
  const alertConfig = {
    critical: {
      icon: XCircle,
      bgColor: "bg-destructive/10",
      textColor: "text-destructive",
      borderColor: "border-destructive/20",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-warning/10",
      textColor: "text-warning",
      borderColor: "border-warning/20",
    },
    info: {
      icon: Info,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      borderColor: "border-primary/20",
    },
    success: {
      icon: CheckCircle,
      bgColor: "bg-success/10",
      textColor: "text-success",
      borderColor: "border-success/20",
    },
  };

  const config = alertConfig[alert.type];
  const Icon = config.icon;

  return (
    <Card className={`border ${config.borderColor}`}>
      <div className="p-4">
        <div className="flex gap-3">
          <div className={`${config.bgColor} ${config.textColor} rounded-lg p-2 h-fit`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold">{alert.title}</h4>
              <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
            </div>
            <p className="text-sm text-muted-foreground">{alert.description}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
