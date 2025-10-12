import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, User, Car, Clock, CheckCircle } from "lucide-react";

const Tours = () => {
  const tours = [
    {
      id: "1",
      name: "Livraison Zone Nord",
      driver: "Jean Dupont",
      vehicle: "Renault Master - AB-123-CD",
      status: "in-progress",
      stops: 5,
      completedStops: 2,
      startTime: "08:00",
      estimatedEnd: "16:30",
      distance: 145,
    },
    {
      id: "2",
      name: "Circuit Centre-Ville",
      driver: "Marie Martin",
      vehicle: "Peugeot Partner - EF-456-GH",
      status: "scheduled",
      stops: 8,
      completedStops: 0,
      startTime: "09:00",
      estimatedEnd: "17:00",
      distance: 78,
    },
    {
      id: "3",
      name: "Tournée Sud",
      driver: "Pierre Bernard",
      vehicle: "Ford Transit - MN-012-OP",
      status: "completed",
      stops: 6,
      completedStops: 6,
      startTime: "07:30",
      estimatedEnd: "15:00",
      distance: 165,
    },
  ];

  const statusConfig = {
    scheduled: {
      label: "Planifiée",
      color: "bg-primary text-primary-foreground",
    },
    "in-progress": {
      label: "En cours",
      color: "bg-warning text-warning-foreground",
    },
    completed: {
      label: "Terminée",
      color: "bg-success text-success-foreground",
    },
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des tournées</h1>
          <p className="text-muted-foreground mt-1">
            Planifiez et suivez vos missions
          </p>
        </div>
        <Button className="gradient-primary border-0">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tournée
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aujourd'hui</p>
              <p className="text-2xl font-bold">{tours.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-3">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En cours</p>
              <p className="text-2xl font-bold text-warning">
                {tours.filter(t => t.status === "in-progress").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-3">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Terminées</p>
              <p className="text-2xl font-bold text-success">
                {tours.filter(t => t.status === "completed").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-3">
              <MapPin className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Distance totale</p>
              <p className="text-2xl font-bold">388 km</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tours List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tournées du jour</h2>
        <div className="grid gap-4">
          {tours.map((tour) => (
            <Card key={tour.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-xl">{tour.name}</h3>
                    <Badge className={`${statusConfig[tour.status as keyof typeof statusConfig].color} mt-2`}>
                      {statusConfig[tour.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="text-xl font-bold">{tour.distance} km</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Conducteur</p>
                      <p className="text-sm font-medium">{tour.driver}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Véhicule</p>
                      <p className="text-sm font-medium">{tour.vehicle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Horaires</p>
                      <p className="text-sm font-medium">{tour.startTime} - {tour.estimatedEnd}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Arrêts: {tour.completedStops}/{tour.stops}
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round((tour.completedStops / tour.stops) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(tour.completedStops / tour.stops) * 100}%` }}
                    />
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

export default Tours;
