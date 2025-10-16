import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, AlertCircle, CheckCircle, Clock, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentDialog } from "@/components/DocumentDialog";

const Documents = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: documentsData }, { data: vehiclesData }] = await Promise.all([
        supabase
          .from("documents")
          .select(`*, vehicles (brand, model, plate)`)
          .order("expiry_date"),
        supabase.from("vehicles").select("*").order("brand"),
      ]);

      if (documentsData) setDocuments(documentsData);
      if (vehiclesData) setVehicles(vehiclesData);
    } catch (error: any) {
      toast.error("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) return;

    try {
      const { error } = await supabase.from("documents").delete().eq("id", id);
      if (error) throw error;
      toast.success("Document supprimé");
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (document: any) => {
    setSelectedDocument(document);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedDocument(null);
    setDialogOpen(true);
  };

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
    valid: documents.filter((d) => d.status === "valid").length,
    expiringSoon: documents.filter((d) => d.status === "expiring-soon").length,
    expired: documents.filter((d) => d.status === "expired").length,
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
        <Button className="gradient-primary border-0" onClick={handleAdd}>
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
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Chargement...</p>
        ) : documents.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Aucun document enregistré</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => {
              const config = statusConfig[doc.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;
              const vehicleInfo = doc.vehicles
                ? `${doc.vehicles.brand} ${doc.vehicles.model} - ${doc.vehicles.plate}`
                : "Véhicule inconnu";

              const expiryDate = new Date(doc.expiry_date);
              const today = new Date();
              const daysUntilExpiry = Math.ceil(
                (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <Card key={doc.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div
                        className={`rounded-lg p-3 ${
                          doc.status === "valid"
                            ? "bg-success/10"
                            : doc.status === "expiring-soon"
                            ? "bg-warning/10"
                            : "bg-destructive/10"
                        }`}
                      >
                        <StatusIcon className={`h-6 w-6 ${config.iconColor}`} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{doc.type}</h3>
                            <p className="text-sm text-muted-foreground">{vehicleInfo}</p>
                          </div>
                          <Badge className={config.color}>{config.label}</Badge>
                        </div>

                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="text-muted-foreground">Expiration: </span>
                            <span className="font-medium">
                              {expiryDate.toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          {daysUntilExpiry >= 0 && (
                            <div>
                              <span className="text-muted-foreground">Dans </span>
                              <span
                                className={`font-medium ${
                                  daysUntilExpiry < 30 ? "text-warning" : ""
                                }`}
                              >
                                {daysUntilExpiry} jours
                              </span>
                            </div>
                          )}
                          {daysUntilExpiry < 0 && (
                            <div>
                              <span className="text-destructive font-medium">
                                Expiré depuis {Math.abs(daysUntilExpiry)} jours
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-border">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(doc)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <DocumentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        document={selectedDocument}
        vehicles={vehicles}
        onSave={fetchData}
      />
    </div>
  );
};

export default Documents;
