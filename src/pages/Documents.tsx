import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";

const Documents = () => {
  const documents = [
    {
      id: "1",
      vehicle: "Renault Master - AB-123-CD",
      type: "Assurance",
      expiryDate: "2026-03-15",
      status: "valid",
      daysUntilExpiry: 124,
    },
    {
      id: "2",
      vehicle: "Peugeot Partner - EF-456-GH",
      type: "Contrôle technique",
      expiryDate: "2025-11-20",
      status: "expiring-soon",
      daysUntilExpiry: 8,
    },
    {
      id: "3",
      vehicle: "Citroën Berlingo - IJ-789-KL",
      type: "Carte grise",
      expiryDate: "2025-11-05",
      status: "expired",
      daysUntilExpiry: -7,
    },
    {
      id: "4",
      vehicle: "Ford Transit - MN-012-OP",
      type: "Permis de conduire",
      expiryDate: "2027-06-30",
      status: "valid",
      daysUntilExpiry: 597,
    },
  ];

  const statusConfig = {
    valid: {
      label: "Valide",
      color: "bg-success text-success-foreground",
      icon: CheckCircle,
      iconColor: "text-success",
    },
    "expiring-soon": {
      label: "Expire bientôt",
      color: "bg-warning text-warning-foreground",
      icon: Clock,
      iconColor: "text-warning",
    },
    expired: {
      label: "Expiré",
      color: "bg-destructive text-destructive-foreground",
      icon: AlertCircle,
      iconColor: "text-destructive",
    },
  };

  const stats = {
    total: documents.length,
    valid: documents.filter(d => d.status === "valid").length,
    expiringSoon: documents.filter(d => d.status === "expiring-soon").length,
    expired: documents.filter(d => d.status === "expired").length,
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des documents</h1>
          <p className="text-muted-foreground mt-1">
            Suivez les documents obligatoires
          </p>
        </div>
        <Button className="gradient-primary border-0">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
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
              <p className="text-sm text-muted-foreground">Valides</p>
              <p className="text-2xl font-bold text-success">{stats.valid}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-3">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">À renouveler</p>
              <p className="text-2xl font-bold text-warning">{stats.expiringSoon}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expirés</p>
              <p className="text-2xl font-bold text-destructive">{stats.expired}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Documents</h2>
        <div className="grid gap-4">
          {documents.map((doc) => {
            const config = statusConfig[doc.status as keyof typeof statusConfig];
            const StatusIcon = config.icon;
            
            return (
              <Card key={doc.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className={`rounded-lg p-3 ${doc.status === 'valid' ? 'bg-success/10' : doc.status === 'expiring-soon' ? 'bg-warning/10' : 'bg-destructive/10'}`}>
                      <StatusIcon className={`h-6 w-6 ${config.iconColor}`} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{doc.type}</h3>
                          <p className="text-sm text-muted-foreground">{doc.vehicle}</p>
                        </div>
                        <Badge className={config.color}>
                          {config.label}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Expiration: </span>
                          <span className="font-medium">
                            {new Date(doc.expiryDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        {doc.status !== 'expired' && (
                          <div>
                            <span className="text-muted-foreground">Dans </span>
                            <span className={`font-medium ${doc.daysUntilExpiry < 30 ? 'text-warning' : ''}`}>
                              {doc.daysUntilExpiry} jours
                            </span>
                          </div>
                        )}
                        {doc.status === 'expired' && (
                          <div>
                            <span className="text-destructive font-medium">
                              Expiré depuis {Math.abs(doc.daysUntilExpiry)} jours
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2">
                        <Button variant="outline" size="sm">
                          Renouveler
                        </Button>
                      </div>
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

export default Documents;
