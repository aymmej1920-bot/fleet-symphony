import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingDown, TrendingUp, Fuel as FuelIcon, DollarSign } from "lucide-react";

const Fuel = () => {
  const fuelRecords = [
    {
      id: "1",
      vehicle: "Renault Master - AB-123-CD",
      date: "10/11/2025",
      liters: 65,
      cost: 97.5,
      mileage: 45320,
      consumption: 8.2,
      trend: "up",
    },
    {
      id: "2",
      vehicle: "Peugeot Partner - EF-456-GH",
      date: "09/11/2025",
      liters: 45,
      cost: 67.5,
      mileage: 32150,
      consumption: 6.5,
      trend: "down",
    },
    {
      id: "3",
      vehicle: "Ford Transit - MN-012-OP",
      date: "08/11/2025",
      liters: 70,
      cost: 105,
      mileage: 28450,
      consumption: 9.1,
      trend: "up",
    },
  ];

  const monthlyStats = {
    totalCost: 1245,
    totalLiters: 780,
    avgConsumption: 7.8,
    anomalies: 2,
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion du carburant</h1>
          <p className="text-muted-foreground mt-1">
            Suivez la consommation et les coûts
          </p>
        </div>
        <Button className="gradient-primary border-0">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un plein
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Coût total</p>
              <p className="text-2xl font-bold">€{monthlyStats.totalCost}</p>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-3">
              <FuelIcon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Volume total</p>
              <p className="text-2xl font-bold">{monthlyStats.totalLiters}L</p>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-3">
              <TrendingDown className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Consommation moy.</p>
              <p className="text-2xl font-bold">{monthlyStats.avgConsumption}</p>
              <p className="text-xs text-muted-foreground">L/100km</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-3">
              <TrendingUp className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Anomalies</p>
              <p className="text-2xl font-bold text-warning">{monthlyStats.anomalies}</p>
              <p className="text-xs text-muted-foreground">À vérifier</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Derniers pleins</h2>
        <div className="grid gap-4">
          {fuelRecords.map((record) => (
            <Card key={record.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{record.vehicle}</h3>
                      <p className="text-sm text-muted-foreground">{record.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">€{record.cost}</p>
                      <Badge variant="outline" className="mt-1">
                        {record.liters}L
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Kilométrage</p>
                      <p className="font-medium">{record.mileage.toLocaleString()} km</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Consommation</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{record.consumption} L/100km</p>
                        {record.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-destructive" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-success" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Prix/litre</p>
                      <p className="font-medium">€{(record.cost / record.liters).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fuel;
