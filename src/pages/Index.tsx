import { useState, useEffect } from "react";
import { StatsCard } from "@/components/StatsCard";
import { VehicleCard } from "@/components/VehicleCard";
import { AlertCard } from "@/components/AlertCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Car, 
  Users, 
  Wrench, 
  AlertTriangle,
  Fuel,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vehiclesRes, driversRes, maintenancesRes, documentsRes] = await Promise.all([
        supabase.from("vehicles").select("*"),
        supabase.from("drivers").select("*"),
        supabase.from("maintenance_records").select("*"),
        supabase.from("documents").select("*, vehicles(brand, model, plate)"),
      ]);

      if (vehiclesRes.error) throw vehiclesRes.error;
      if (driversRes.error) throw driversRes.error;
      if (maintenancesRes.error) throw maintenancesRes.error;
      if (documentsRes.error) throw documentsRes.error;

      setVehicles(vehiclesRes.data || []);
      setDrivers(driversRes.data || []);
      setMaintenances(maintenancesRes.data || []);
      setDocuments(documentsRes.data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const activeVehicles = vehicles.filter(v => v.status === "active").length;
  const scheduledMaintenances = maintenances.filter(m => m.status === "scheduled").length;
  const today = new Date();
  const expiredDocs = documents.filter(d => new Date(d.expiry_date) < today).length;
  const lowFuelVehicles = vehicles.filter(v => v.fuel_level < 30).length;
  const totalAlerts = expiredDocs + lowFuelVehicles;

  const stats = [
    {
      title: "Véhicules actifs",
      value: activeVehicles,
      icon: Car,
      variant: "success" as const,
      trend: { value: vehicles.length - activeVehicles, label: "autres statuts" }
    },
    {
      title: "Conducteurs",
      value: drivers.length,
      icon: Users,
      variant: "default" as const,
      trend: { value: drivers.filter(d => d.status === "available").length, label: "disponibles" }
    },
    {
      title: "Maintenances prévues",
      value: scheduledMaintenances,
      icon: Wrench,
      variant: "warning" as const,
      trend: { value: maintenances.filter(m => m.status === "in-progress").length, label: "en cours" }
    },
    {
      title: "Alertes actives",
      value: totalAlerts,
      icon: AlertTriangle,
      variant: "destructive" as const,
      trend: { value: expiredDocs, label: "documents expirés" }
    }
  ];

  const recentVehicles = vehicles
    .slice(0, 3)
    .map(v => ({
      ...v,
      nextMaintenance: v.next_maintenance_date 
        ? new Date(v.next_maintenance_date).toLocaleDateString("fr-FR")
        : "Non définie",
      fuelLevel: v.fuel_level
    }));

  const alerts = [
    ...documents
      .filter(d => new Date(d.expiry_date) < today)
      .slice(0, 2)
      .map(d => ({
        id: d.id,
        type: "critical" as const,
        title: "Document expiré",
        description: `${d.type} - ${d.vehicles?.brand} ${d.vehicles?.model} (${d.vehicles?.plate})`,
        timestamp: `Expiré le ${new Date(d.expiry_date).toLocaleDateString("fr-FR")}`
      })),
    ...vehicles
      .filter(v => v.fuel_level < 30)
      .slice(0, 1)
      .map(v => ({
        id: v.id,
        type: "warning" as const,
        title: "Niveau de carburant bas",
        description: `${v.brand} ${v.model} (${v.plate}) - ${v.fuel_level}% restant`,
        timestamp: "Maintenant"
      }))
  ].slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Stats Grid */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Vue d'ensemble</h2>
          <p className="text-muted-foreground">Statistiques en temps réel de votre flotte</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="p-6 hover:shadow-lg transition-all cursor-pointer border-border hover:border-accent/50"
          onClick={() => navigate('/fuel')}
        >
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

        <Card 
          className="p-6 hover:shadow-lg transition-all cursor-pointer border-border hover:border-primary/50"
          onClick={() => navigate('/tours')}
        >
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

        <Card 
          className="p-6 hover:shadow-lg transition-all cursor-pointer border-border hover:border-warning/50"
          onClick={() => navigate('/reports')}
        >
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
              <h2 className="text-2xl font-bold">Véhicules récents</h2>
              <p className="text-sm text-muted-foreground">Aperçu de votre flotte</p>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-8">Chargement...</p>
          ) : (
            <>
              <div className="grid gap-4">
                {recentVehicles.map((vehicle) => (
                  <VehicleCard 
                    key={vehicle.id} 
                    vehicle={vehicle}
                    onClick={() => navigate('/vehicles')}
                  />
                ))}
              </div>

              {recentVehicles.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Aucun véhicule</p>
              )}

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/vehicles')}
              >
                Voir tous les véhicules ({vehicles.length})
              </Button>
            </>
          )}
        </section>

        {/* Alerts Sidebar */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Alertes récentes</h2>
            <p className="text-sm text-muted-foreground">Notifications importantes</p>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-8">Chargement...</p>
          ) : (
            <>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>

              {alerts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Aucune alerte</p>
              )}

              <Button variant="outline" className="w-full">
                Voir toutes les alertes ({totalAlerts})
              </Button>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
