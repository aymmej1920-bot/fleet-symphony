import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, TrendingUp, TrendingDown, DollarSign, Fuel, Wrench, BarChart3 } from "lucide-react";

const Reports = () => {
  const monthlyData = {
    totalCost: 15340,
    fuelCost: 8450,
    maintenanceCost: 6890,
    vehicleUtilization: 87,
    trends: {
      cost: -5,
      fuel: 3,
      maintenance: -12,
    }
  };

  const topVehicles = [
    { vehicle: "Renault Master - AB-123-CD", cost: 2340, efficiency: 92 },
    { vehicle: "Peugeot Partner - EF-456-GH", cost: 1850, efficiency: 88 },
    { vehicle: "Ford Transit - MN-012-OP", cost: 2150, efficiency: 85 },
  ];

  const topDrivers = [
    { name: "Marie Martin", trips: 203, rating: 4.9, consumption: 6.5 },
    { name: "Jean Dupont", trips: 145, rating: 4.8, consumption: 8.2 },
    { name: "Sophie Dubois", trips: 176, rating: 4.7, consumption: 7.1 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rapports et analyses</h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble des performances
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter les données
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Coût total</p>
              <p className="text-2xl font-bold">€{monthlyData.totalCost.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs mt-1">
                {monthlyData.trends.cost < 0 ? (
                  <>
                    <TrendingDown className="h-3 w-3 text-success" />
                    <span className="text-success">{Math.abs(monthlyData.trends.cost)}% vs mois dernier</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-3 w-3 text-destructive" />
                    <span className="text-destructive">+{monthlyData.trends.cost}% vs mois dernier</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-3">
              <Fuel className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Carburant</p>
              <p className="text-2xl font-bold">€{monthlyData.fuelCost.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs mt-1">
                <TrendingUp className="h-3 w-3 text-destructive" />
                <span className="text-destructive">+{monthlyData.trends.fuel}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-3">
              <Wrench className="h-6 w-6 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Maintenance</p>
              <p className="text-2xl font-bold">€{monthlyData.maintenanceCost.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs mt-1">
                <TrendingDown className="h-3 w-3 text-success" />
                <span className="text-success">{Math.abs(monthlyData.trends.maintenance)}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-3">
              <BarChart3 className="h-6 w-6 text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Utilisation</p>
              <p className="text-2xl font-bold">{monthlyData.vehicleUtilization}%</p>
              <p className="text-xs text-muted-foreground mt-1">Flotte active</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="vehicles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vehicles">Par véhicule</TabsTrigger>
          <TabsTrigger value="drivers">Par conducteur</TabsTrigger>
          <TabsTrigger value="costs">Coûts détaillés</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top 3 véhicules par coûts</h3>
              <div className="space-y-4">
                {topVehicles.map((vehicle, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{vehicle.vehicle}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Coût: €{vehicle.cost}</span>
                        <span>Efficacité: {vehicle.efficiency}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top 3 conducteurs</h3>
              <div className="space-y-4">
                {topDrivers.map((driver, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{driver.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{driver.trips} trajets</span>
                        <span>{driver.rating} ★</span>
                        <span>{driver.consumption} L/100km</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Répartition des coûts</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Carburant</span>
                    <span className="text-sm font-medium">€{monthlyData.fuelCost} (55%)</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: '55%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Maintenance</span>
                    <span className="text-sm font-medium">€{monthlyData.maintenanceCost} (45%)</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-warning" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
