import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Wrench, AlertTriangle, CheckCircle } from "lucide-react";

const Maintenance = () => {
  const scheduledMaintenance = [
    {
      id: "1",
      vehicle: "Renault Master - AB-123-CD",
      type: "Révision",
      date: "15/11/2025",
      mileage: 50000,
      status: "scheduled",
      priority: "medium",
    },
    {
      id: "2",
      vehicle: "Peugeot Partner - EF-456-GH",
      type: "Vidange",
      date: "22/11/2025",
      mileage: 35000,
      status: "scheduled",
      priority: "low",
    },
    {
      id: "3",
      vehicle: "Citroën Berlingo - IJ-789-KL",
      type: "Contrôle technique",
      date: "En cours",
      mileage: 68000,
      status: "in-progress",
      priority: "high",
    },
  ];

  const maintenanceHistory = [
    {
      id: "h1",
      vehicle: "Ford Transit - MN-012-OP",
      type: "Remplacement pneus",
      date: "05/10/2025",
      cost: 450,
      status: "completed",
    },
    {
      id: "h2",
      vehicle: "Mercedes Sprinter - QR-345-ST",
      type: "Révision complète",
      date: "28/09/2025",
      cost: 680,
      status: "completed",
    },
  ];

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
        <Button className="gradient-primary border-0">
          <Plus className="h-4 w-4 mr-2" />
          Planifier une maintenance
        </Button>
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
            {scheduledMaintenance.filter(m => m.status === "in-progress").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Ce mois</p>
          <p className="text-2xl font-bold">7</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Coût total</p>
          <p className="text-2xl font-bold">€1,130</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduled">Planifiées</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          {scheduledMaintenance.map((item) => {
            const StatusIcon = statusConfig[item.status as keyof typeof statusConfig].icon;
            return (
              <Card key={item.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className={`rounded-lg p-3 ${item.status === 'in-progress' ? 'bg-warning/10' : 'bg-primary/10'}`}>
                      <StatusIcon className={`h-6 w-6 ${item.status === 'in-progress' ? 'text-warning' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{item.type}</h3>
                          <p className="text-sm text-muted-foreground">{item.vehicle}</p>
                        </div>
                        <Badge className={statusConfig[item.status as keyof typeof statusConfig].color}>
                          {statusConfig[item.status as keyof typeof statusConfig].label}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{item.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Kilométrage:</span>
                          <span className="font-medium">{item.mileage.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`h-4 w-4 ${priorityConfig[item.priority as keyof typeof priorityConfig].color}`} />
                          <span className={priorityConfig[item.priority as keyof typeof priorityConfig].color}>
                            Priorité {priorityConfig[item.priority as keyof typeof priorityConfig].label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {maintenanceHistory.map((item) => (
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
                        <p className="text-sm text-muted-foreground">{item.vehicle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">€{item.cost}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Maintenance;
