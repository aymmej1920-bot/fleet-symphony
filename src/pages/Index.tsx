import { StatsCard } from "@/components/StatsCard";
import { VehicleCard } from "@/components/VehicleCard";
import { AlertCard } from "@/components/AlertCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Car, 
  Users, 
  Wrench, 
  AlertTriangle, 
  TrendingUp,
  Fuel,
  Calendar,
  Plus,
  Search,
  Bell
} from "lucide-react";

const Index = () => {
  // Mock data - À remplacer par des données réelles plus tard
  const stats = [
    {
      title: "Véhicules actifs",
      value: 42,
      icon: Car,
      variant: "success" as const,
      trend: { value: 8, label: "vs mois dernier" }
    },
    {
      title: "Conducteurs",
      value: 56,
      icon: Users,
      variant: "default" as const,
      trend: { value: 3, label: "nouveaux" }
    },
    {
      title: "Maintenances prévues",
      value: 7,
      icon: Wrench,
      variant: "warning" as const,
      trend: { value: 2, label: "cette semaine" }
    },
    {
      title: "Alertes actives",
      value: 3,
      icon: AlertTriangle,
      variant: "destructive" as const,
      trend: { value: -40, label: "vs hier" }
    }
  ];

  const vehicles = [
    {
      id: "1",
      brand: "Renault",
      model: "Master",
      plate: "AB-123-CD",
      status: "active" as const,
      mileage: 45320,
      fuelLevel: 75,
      nextMaintenance: "15/11/2025"
    },
    {
      id: "2",
      brand: "Peugeot",
      model: "Partner",
      plate: "EF-456-GH",
      status: "active" as const,
      mileage: 32150,
      fuelLevel: 45,
      nextMaintenance: "22/11/2025"
    },
    {
      id: "3",
      brand: "Citroën",
      model: "Berlingo",
      plate: "IJ-789-KL",
      status: "maintenance" as const,
      mileage: 67890,
      fuelLevel: 30,
      nextMaintenance: "En cours"
    }
  ];

  const alerts = [
    {
      id: "1",
      type: "critical" as const,
      title: "Maintenance urgente requise",
      description: "Renault Master (AB-123-CD) - Contrôle technique expiré",
      timestamp: "Il y a 2h"
    },
    {
      id: "2",
      type: "warning" as const,
      title: "Niveau de carburant bas",
      description: "Citroën Berlingo (IJ-789-KL) - 30% restant",
      timestamp: "Il y a 4h"
    },
    {
      id: "3",
      type: "info" as const,
      title: "Rapport mensuel disponible",
      description: "Le rapport d'activité d'octobre est prêt à être consulté",
      timestamp: "Il y a 1j"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="gradient-primary rounded-xl p-2.5 shadow-glow">
                <Car className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">FleetManager Pro</h1>
                <p className="text-sm text-muted-foreground">Gestion intelligente de flotte</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button className="gradient-primary border-0">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau véhicule
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-border">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-success/10 p-3">
                <Fuel className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">Gestion carburant</h3>
                <p className="text-sm text-muted-foreground">Suivi et analyse</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-border">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Planning</h3>
                <p className="text-sm text-muted-foreground">Tournées & missions</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-border">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-warning/10 p-3">
                <TrendingUp className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold">Rapports</h3>
                <p className="text-sm text-muted-foreground">Analytics & stats</p>
              </div>
            </div>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicles Section */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Véhicules</h2>
                <p className="text-sm text-muted-foreground">Gestion et suivi de votre flotte</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher un véhicule..." 
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {vehicles.map((vehicle) => (
                <VehicleCard 
                  key={vehicle.id} 
                  vehicle={vehicle}
                  onClick={() => console.log(`Voir détails: ${vehicle.id}`)}
                />
              ))}
            </div>

            <Button variant="outline" className="w-full">
              Voir tous les véhicules ({42})
            </Button>
          </section>

          {/* Alerts Sidebar */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Alertes récentes</h2>
              <p className="text-sm text-muted-foreground">Notifications importantes</p>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>

            <Button variant="outline" className="w-full">
              Voir toutes les alertes
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
