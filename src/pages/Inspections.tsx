import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ClipboardCheck, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const Inspections = () => {
  const inspections = [
    {
      id: "1",
      vehicle: "Renault Master - AB-123-CD",
      type: "Inspection quotidienne",
      date: "12/11/2025 08:30",
      inspector: "Jean Dupont",
      status: "passed",
      issues: 0,
      score: 100,
    },
    {
      id: "2",
      vehicle: "Peugeot Partner - EF-456-GH",
      type: "Inspection avant tournée",
      date: "12/11/2025 07:45",
      inspector: "Marie Martin",
      status: "passed-with-warnings",
      issues: 2,
      score: 85,
    },
    {
      id: "3",
      vehicle: "Citroën Berlingo - IJ-789-KL",
      type: "Inspection complète",
      date: "11/11/2025 14:20",
      inspector: "Pierre Bernard",
      status: "failed",
      issues: 5,
      score: 60,
    },
  ];

  const statusConfig = {
    passed: {
      label: "Réussie",
      color: "bg-success text-success-foreground",
      icon: CheckCircle,
      iconColor: "text-success",
    },
    "passed-with-warnings": {
      label: "Réussie avec avertissements",
      color: "bg-warning text-warning-foreground",
      icon: AlertTriangle,
      iconColor: "text-warning",
    },
    failed: {
      label: "Échouée",
      color: "bg-destructive text-destructive-foreground",
      icon: XCircle,
      iconColor: "text-destructive",
    },
  };

  const stats = {
    total: inspections.length,
    passed: inspections.filter(i => i.status === "passed").length,
    warnings: inspections.filter(i => i.status === "passed-with-warnings").length,
    failed: inspections.filter(i => i.status === "failed").length,
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des inspections</h1>
          <p className="text-muted-foreground mt-1">
            Suivez les contrôles et anomalies
          </p>
        </div>
        <Button className="gradient-primary border-0">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle inspection
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <ClipboardCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total aujourd'hui</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-3">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Réussies</p>
              <p className="text-2xl font-bold text-success">{stats.passed}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-3">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avertissements</p>
              <p className="text-2xl font-bold text-warning">{stats.warnings}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-3">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Échouées</p>
              <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Inspections List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Inspections récentes</h2>
        <div className="grid gap-4">
          {inspections.map((inspection) => {
            const config = statusConfig[inspection.status as keyof typeof statusConfig];
            const StatusIcon = config.icon;
            
            return (
              <Card key={inspection.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className={`rounded-lg p-3 ${
                      inspection.status === 'passed' ? 'bg-success/10' : 
                      inspection.status === 'passed-with-warnings' ? 'bg-warning/10' : 
                      'bg-destructive/10'
                    }`}>
                      <StatusIcon className={`h-6 w-6 ${config.iconColor}`} />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{inspection.type}</h3>
                          <p className="text-sm text-muted-foreground">{inspection.vehicle}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={config.color}>
                            {config.label}
                          </Badge>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{inspection.score}%</p>
                            <p className="text-xs text-muted-foreground">Score</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p className="font-medium">{inspection.date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Inspecteur</p>
                          <p className="font-medium">{inspection.inspector}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Anomalies</p>
                          <p className={`font-medium ${inspection.issues > 0 ? 'text-warning' : 'text-success'}`}>
                            {inspection.issues} détectée{inspection.issues > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {inspection.issues > 0 && (
                        <div className="pt-2 border-t border-border">
                          <Button variant="outline" size="sm">
                            Voir les anomalies ({inspection.issues})
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Inspections;
