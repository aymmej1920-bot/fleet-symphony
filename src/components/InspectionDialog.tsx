import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";

const inspectionSchema = z.object({
  vehicle_id: z.string().uuid({ message: "Véhicule requis" }),
  type: z.string().trim().min(1, { message: "Type requis" }).max(100, { message: "Type trop long" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date invalide" }),
  inspector: z.string().trim().min(1, { message: "Inspecteur requis" }).max(100, { message: "Nom de l'inspecteur trop long" }),
  status: z.enum(["pending", "passed", "passed-with-warnings", "failed"], { message: "Statut invalide" }),
  score: z.number().int().min(0, { message: "Score doit être positif" }).max(100, { message: "Score maximum 100" }).optional().or(z.literal(0)),
  issues_found: z.number().int().min(0, { message: "Nombre d'anomalies invalide" }).max(1000),
  notes: z.string().trim().max(1000, { message: "Notes trop longues (max 1000 caractères)" }).optional().or(z.literal("")),
});

interface InspectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection: any;
  vehicles: any[];
  onSave: () => void;
}

export const InspectionDialog = ({ open, onOpenChange, inspection, vehicles, onSave }: InspectionDialogProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    vehicle_id: "",
    type: "",
    date: new Date().toISOString().split('T')[0],
    inspector: "",
    status: "pending",
    score: 0,
    issues_found: 0,
    notes: "",
  });

  useEffect(() => {
    if (inspection) {
      setFormData({
        vehicle_id: inspection.vehicle_id || "",
        type: inspection.type || "",
        date: inspection.date || new Date().toISOString().split('T')[0],
        inspector: inspection.inspector || "",
        status: inspection.status || "pending",
        score: inspection.score || 0,
        issues_found: inspection.issues_found || 0,
        notes: inspection.notes || "",
      });
    } else {
      setFormData({
        vehicle_id: "",
        type: "",
        date: new Date().toISOString().split('T')[0],
        inspector: "",
        status: "pending",
        score: 0,
        issues_found: 0,
        notes: "",
      });
    }
  }, [inspection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    try {
      const validatedData = inspectionSchema.parse({
        vehicle_id: formData.vehicle_id,
        type: formData.type,
        date: formData.date,
        inspector: formData.inspector,
        status: formData.status,
        score: formData.score ? parseInt(formData.score.toString()) : undefined,
        issues_found: parseInt(formData.issues_found.toString()),
        notes: formData.notes || undefined,
      });

      const dataToSave = {
        vehicle_id: validatedData.vehicle_id,
        type: validatedData.type,
        date: validatedData.date,
        inspector: validatedData.inspector,
        status: validatedData.status,
        issues_found: validatedData.issues_found,
        score: validatedData.score || null,
        notes: validatedData.notes || null,
        user_id: user.id,
      };

      if (inspection) {
        const { error } = await supabase
          .from("inspections")
          .update(dataToSave)
          .eq("id", inspection.id);

        if (error) throw error;
        toast.success("Inspection modifiée avec succès");
      } else {
        const { error } = await supabase.from("inspections").insert([dataToSave]);

        if (error) throw error;
        toast.success("Inspection ajoutée avec succès");
      }

      onSave();
      onOpenChange(false);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Une erreur est survenue");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {inspection ? "Modifier l'inspection" : "Nouvelle inspection"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle_id">Véhicule *</Label>
              <Select
                value={formData.vehicle_id}
                onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} - {vehicle.plate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Type d'inspection *</Label>
              <Input
                id="type"
                required
                placeholder="Ex: Inspection quotidienne..."
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="inspector">Inspecteur *</Label>
              <Input
                id="inspector"
                required
                value={formData.inspector}
                onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="passed">Réussie</SelectItem>
                  <SelectItem value="passed-with-warnings">Réussie avec avertissements</SelectItem>
                  <SelectItem value="failed">Échouée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="score">Score (%)</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="issues_found">Anomalies trouvées</Label>
              <Input
                id="issues_found"
                type="number"
                min="0"
                value={formData.issues_found}
                onChange={(e) => setFormData({ ...formData, issues_found: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="gradient-primary border-0">
              {inspection ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
