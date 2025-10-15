import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Wrench, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MaintenanceDialog } from "@/components/MaintenanceDialog";

const Maintenance = () => {
  const { toast } = useToast();
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: maintenanceData }, { data: vehiclesData }] = await Promise.all([
        supabase
          .from("maintenance_records")
          .select(`
            *,
            vehicles (brand, model, plate)
          `)
          .order("date", { ascending: true }),
        supabase.from("vehicles").select("*"),
      ]);

      if (maintenanceData) setMaintenance(maintenanceData);
      if (vehiclesData) setVehicles(vehiclesData);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet enregistrement ?")) return;

    try {
      const { error } = await supabase
        .from("maintenance_records")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Supprimé",
        description: "L'enregistrement a été supprimé",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const scheduledMaintenance = maintenance.filter((m) => m.status !== "completed");
  const maintenanceHistory = maintenance.filter((m) => m.status === "completed");

  const statusConfig = {
    scheduled: { label: "Planifié", color: "bg-primary text-primary-foreground", icon: Calendar },
    "in-progress": { label: "En cours", color: "bg-warning text-warning-foreground", icon: Wrench },
    completed: { label: "Terminé", color: "bg-success text-success-foreground", icon: CheckCircle },
  };

  const priorityConfig = {
    high: { label: "Haute", color: "text-destructive" },
    medium: { label: "Moyenne", color: "text-warning" },
    low: { label: "Basse", color: "text-success" },
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion de la maintenance</h1>
          <p className="text-muted-foreground mt-1">
            Planifiez et suivez les interventions
          </p>
        </div>
        <MaintenanceDialog vehicles={vehicles} onSuccess={fetchData} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total planifiées</p>
          <p className="text-2xl font-bold">{scheduledMaintenance.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">En cours</p>
          <p className="text-2xl font-bold text-warning">
            {scheduledMaintenance.filter((m) => m.status === "in-progress").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Terminées</p>
          <p className="text-2xl font-bold">{maintenanceHistory.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Coût total</p>
          <p className="text-2xl font-bold">
            €
            {maintenance
              .reduce((sum, m) => sum + (parseFloat(m.cost) || 0), 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduled">Planifiées</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Chargement...</p>
          ) : scheduledMaintenance.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune maintenance planifiée
            </p>
          ) : (
            scheduledMaintenance.map((item) => {
              const StatusIcon = statusConfig[item.status as keyof typeof statusConfig].icon;
              const vehicleInfo = item.vehicles
                ? `${item.vehicles.brand} ${item.vehicles.model} - ${item.vehicles.plate}`
                : "Véhicule inconnu";
              
              return (
                <Card key={item.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div
                        className={`rounded-lg p-3 ${
                          item.status === "in-progress" ? "bg-warning/10" : "bg-primary/10"
                        }`}
                      >
                        <StatusIcon
                          className={`h-6 w-6 ${
                            item.status === "in-progress" ? "text-warning" : "text-primary"
                          }`}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{item.type}</h3>
                            <p className="text-sm text-muted-foreground">{vehicleInfo}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              className={
                                statusConfig[item.status as keyof typeof statusConfig].color
                              }
                            >
                              {statusConfig[item.status as keyof typeof statusConfig].label}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-6 text-sm flex-wrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(item.date).toLocaleDateString("fr-FR")}</span>
                          </div>
                          {item.mileage && (
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Kilométrage:</span>
                              <span className="font-medium">
                                {item.mileage.toLocaleString()} km
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <AlertTriangle
                              className={`h-4 w-4 ${
                                priorityConfig[item.priority as keyof typeof priorityConfig]
                                  .color
                              }`}
                            />
                            <span
                              className={
                                priorityConfig[item.priority as keyof typeof priorityConfig]
                                  .color
                              }
                            >
                              Priorité{" "}
                              {
                                priorityConfig[item.priority as keyof typeof priorityConfig]
                                  .label
                              }
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <MaintenanceDialog
                            vehicles={vehicles}
                            onSuccess={fetchData}
                            editData={item}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Chargement...</p>
          ) : maintenanceHistory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun historique de maintenance
            </p>
          ) : (
            maintenanceHistory.map((item) => {
              const vehicleInfo = item.vehicles
                ? `${item.vehicles.brand} ${item.vehicles.model} - ${item.vehicles.plate}`
                : "Véhicule inconnu";

              return (
                <Card key={item.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="rounded-lg bg-success/10 p-3">
                        <CheckCircle className="h-6 w-6 text-success" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{item.type}</h3>
                            <p className="text-sm text-muted-foreground">{vehicleInfo}</p>
                            {item.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.notes}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            {item.cost && (
                              <p className="text-xl font-bold">€{item.cost}</p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.date).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <MaintenanceDialog
                            vehicles={vehicles}
                            onSuccess={fetchData}
                            editData={item}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Maintenance;
