import { useState } from "react";
import { VehicleCard } from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
    },
    {
      id: "4",
      brand: "Ford",
      model: "Transit",
      plate: "MN-012-OP",
      status: "active" as const,
      mileage: 28450,
      fuelLevel: 90,
      nextMaintenance: "30/11/2025"
    },
    {
      id: "5",
      brand: "Mercedes",
      model: "Sprinter",
      plate: "QR-345-ST",
      status: "inactive" as const,
      mileage: 89120,
      nextMaintenance: "05/12/2025"
    },
  ];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === "active").length,
    maintenance: vehicles.filter(v => v.status === "maintenance").length,
    inactive: vehicles.filter(v => v.status === "inactive").length,
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des véhicules</h1>
          <p className="text-muted-foreground mt-1">
            Gérez et suivez votre flotte de véhicules
          </p>
        </div>
        <Button className="gradient-primary border-0">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un véhicule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Actifs</p>
          <p className="text-2xl font-bold text-success">{stats.active}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">En maintenance</p>
          <p className="text-2xl font-bold text-warning">{stats.maintenance}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Inactifs</p>
          <p className="text-2xl font-bold text-muted-foreground">{stats.inactive}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par marque, modèle ou plaque..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="maintenance">En maintenance</SelectItem>
            <SelectItem value="inactive">Inactifs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onClick={() => console.log(`Voir détails: ${vehicle.id}`)}
          />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun véhicule trouvé</p>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
