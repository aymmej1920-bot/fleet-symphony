import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InspectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection: any;
  vehicles: any[];
  onSave: () => void;
}

export const InspectionDialog = ({ open, onOpenChange, inspection, vehicles, onSave }: InspectionDialogProps) => {
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

    try {
      const dataToSave = {
        ...formData,
        score: formData.score ? parseInt(formData.score.toString()) : null,
        issues_found: parseInt(formData.issues_found.toString()),
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
      toast.error(error.message);
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
