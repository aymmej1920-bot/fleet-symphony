import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Phone, Mail, Car, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DriverDialog } from "@/components/DriverDialog";

const Drivers = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: driversData }, { data: vehiclesData }] = await Promise.all([
        supabase.from("drivers").select("*").order("name"),
        supabase.from("vehicles").select("*").order("brand"),
      ]);

      if (driversData) setDrivers(driversData);
      if (vehiclesData) setVehicles(vehiclesData);
    } catch (error: any) {
      toast.error("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce conducteur ?")) return;

    try {
      const { error } = await supabase.from("drivers").delete().eq("id", id);
      if (error) throw error;
      toast.success("Conducteur supprimé");
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (driver: any) => {
    setSelectedDriver(driver);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedDriver(null);
    setDialogOpen(true);
  };

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusConfig = {
    available: { label: "Disponible", color: "bg-success text-success-foreground" },
    "on-route": { label: "En tournée", color: "bg-primary text-primary-foreground" },
    "off-duty": { label: "Hors service", color: "bg-muted text-muted-foreground" },
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des conducteurs</h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre équipe de conducteurs
          </p>
        </div>
        <Button className="gradient-primary border-0" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un conducteur
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total conducteurs</p>
          <p className="text-2xl font-bold">{drivers.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Disponibles</p>
          <p className="text-2xl font-bold text-success">
            {drivers.filter(d => d.status === "available").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">En tournée</p>
          <p className="text-2xl font-bold text-primary">
            {drivers.filter(d => d.status === "on-route").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Note moyenne</p>
          <p className="text-2xl font-bold">4.75</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un conducteur..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Drivers List */}
      {loading ? (
        <p className="text-center text-muted-foreground py-8">Chargement...</p>
      ) : (
        <div className="grid gap-4">
          {filteredDrivers.map((driver) => {
            const assignedVehicle = vehicles.find((v) => v.id === driver.assigned_vehicle_id);
            const vehicleText = assignedVehicle
              ? `${assignedVehicle.brand} ${assignedVehicle.model} - ${assignedVehicle.plate}`
              : "Non assigné";

            return (
              <Card key={driver.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-6">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {driver.name.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{driver.name}</h3>
                        <Badge
                          className={`${
                            statusConfig[driver.status as keyof typeof statusConfig].color
                          } mt-1`}
                        >
                          {statusConfig[driver.status as keyof typeof statusConfig].label}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span className="text-2xl font-bold">{driver.rating || 5.0}</span>
                          <span className="text-warning text-xl">★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {driver.total_trips || 0} trajets
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{driver.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{driver.phone || "Non renseigné"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span>{vehicleText}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(driver)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(driver.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {filteredDrivers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun conducteur trouvé</p>
            </div>
          )}
        </div>
      )}

      <DriverDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        driver={selectedDriver}
        vehicles={vehicles}
        onSave={fetchData}
      />
    </div>
  );
};

export default Drivers;
