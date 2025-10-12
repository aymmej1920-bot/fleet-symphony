import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Calendar, Fuel, Wrench } from "lucide-react";

interface VehicleCardProps {
  vehicle: {
    id: string;
    brand: string;
    model: string;
    plate: string;
    status: "active" | "maintenance" | "inactive";
    mileage: number;
    fuelLevel?: number;
    nextMaintenance?: string;
  };
  onClick?: () => void;
}

export const VehicleCard = ({ vehicle, onClick }: VehicleCardProps) => {
  const statusColors = {
    active: "bg-success text-success-foreground",
    maintenance: "bg-warning text-warning-foreground",
    inactive: "bg-muted text-muted-foreground",
  };

  const statusLabels = {
    active: "Actif",
    maintenance: "En maintenance",
    inactive: "Inactif",
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all border-border hover:border-primary/50"
      onClick={onClick}
    >
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{vehicle.brand} {vehicle.model}</h3>
              <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
            </div>
          </div>
          <Badge className={statusColors[vehicle.status]}>
            {statusLabels[vehicle.status]}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Kilométrage</p>
              <p className="font-medium">{vehicle.mileage.toLocaleString()} km</p>
            </div>
          </div>
          
          {vehicle.fuelLevel !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <Fuel className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Carburant</p>
                <p className="font-medium">{vehicle.fuelLevel}%</p>
              </div>
            </div>
          )}
        </div>

        {vehicle.nextMaintenance && (
          <div className="flex items-center gap-2 text-sm pt-2 border-t border-border">
            <Wrench className="h-4 w-4 text-warning" />
            <span className="text-muted-foreground">Prochaine maintenance:</span>
            <span className="font-medium">{vehicle.nextMaintenance}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
