import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingDown, TrendingUp, Fuel as FuelIcon, DollarSign, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FuelDialog } from "@/components/FuelDialog";

const Fuel = () => {
  const [fuelRecords, setFuelRecords] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: fuelData }, { data: vehiclesData }, { data: driversData }] =
        await Promise.all([
          supabase
            .from("fuel_records")
            .select(`*, vehicles (brand, model, plate)`)
            .order("date", { ascending: false }),
          supabase.from("vehicles").select("*").order("brand"),
          supabase.from("drivers").select("*").order("name"),
        ]);

      if (fuelData) setFuelRecords(fuelData);
      if (vehiclesData) setVehicles(vehiclesData);
      if (driversData) setDrivers(driversData);
    } catch (error: any) {
      toast.error("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet enregistrement ?")) return;

    try {
      const { error } = await supabase.from("fuel_records").delete().eq("id", id);
      if (error) throw error;
      toast.success("Plein supprimé");
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (record: any) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedRecord(null);
    setDialogOpen(true);
  };

  const monthlyStats = {
    totalCost: fuelRecords.reduce((sum, r) => sum + (parseFloat(r.cost) || 0), 0),
    totalLiters: fuelRecords.reduce((sum, r) => sum + (parseFloat(r.liters) || 0), 0),
    avgConsumption:
      fuelRecords.length > 0
        ? fuelRecords.reduce((sum, r) => sum + (parseFloat(r.consumption) || 0), 0) /
          fuelRecords.filter((r) => r.consumption).length
        : 0,
    anomalies: fuelRecords.filter((r) => r.consumption && r.consumption > 10).length,
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
        <Button className="gradient-primary border-0" onClick={handleAdd}>
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
              <p className="text-2xl font-bold">{monthlyStats.avgConsumption.toFixed(1)}</p>
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
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Chargement...</p>
        ) : fuelRecords.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Aucun plein enregistré</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {fuelRecords.map((record) => {
              const vehicleInfo = record.vehicles
                ? `${record.vehicles.brand} ${record.vehicles.model} - ${record.vehicles.plate}`
                : "Véhicule inconnu";

              return (
                <Card key={record.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{vehicleInfo}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.date).toLocaleDateString("fr-FR")}
                          </p>
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
                          {record.consumption ? (
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{record.consumption} L/100km</p>
                              {record.consumption > 10 ? (
                                <TrendingUp className="h-4 w-4 text-destructive" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-success" />
                              )}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">Non renseignée</p>
                          )}
                        </div>
                        <div>
                          <p className="text-muted-foreground">Prix/litre</p>
                          <p className="font-medium">
                            €{(record.cost / record.liters).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-border">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(record)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <FuelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        fuelRecord={selectedRecord}
        vehicles={vehicles}
        drivers={drivers}
        onSave={fetchData}
      />
    </div>
  );
};

export default Fuel;
