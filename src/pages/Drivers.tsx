import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Phone, Mail, Car } from "lucide-react";

const Drivers = () => {
  const drivers = [
    {
      id: "1",
      name: "Jean Dupont",
      email: "jean.dupont@email.com",
      phone: "+33 6 12 34 56 78",
      status: "available",
      vehicle: "Renault Master - AB-123-CD",
      trips: 145,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Marie Martin",
      email: "marie.martin@email.com",
      phone: "+33 6 23 45 67 89",
      status: "on-route",
      vehicle: "Peugeot Partner - EF-456-GH",
      trips: 203,
      rating: 4.9,
    },
    {
      id: "3",
      name: "Pierre Bernard",
      email: "pierre.bernard@email.com",
      phone: "+33 6 34 56 78 90",
      status: "available",
      vehicle: "Non assigné",
      trips: 87,
      rating: 4.6,
    },
    {
      id: "4",
      name: "Sophie Dubois",
      email: "sophie.dubois@email.com",
      phone: "+33 6 45 67 89 01",
      status: "off-duty",
      vehicle: "Ford Transit - MN-012-OP",
      trips: 176,
      rating: 4.7,
    },
  ];

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
        <Button className="gradient-primary border-0">
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
        <Input placeholder="Rechercher un conducteur..." className="pl-10" />
      </div>

      {/* Drivers List */}
      <div className="grid gap-4">
        {drivers.map((driver) => (
          <Card key={driver.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-6">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{driver.name}</h3>
                    <Badge className={`${statusConfig[driver.status as keyof typeof statusConfig].color} mt-1`}>
                      {statusConfig[driver.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold">{driver.rating}</span>
                      <span className="text-warning text-xl">★</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{driver.trips} trajets</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{driver.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{driver.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span>{driver.vehicle}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Drivers;
