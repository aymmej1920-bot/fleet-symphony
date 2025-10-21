import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const maintenanceSchema = z.object({
  vehicle_id: z.string().min(1, "Véhicule requis"),
  type: z.string().trim().min(1, "Type requis").max(100, "Type trop long"),
  date: z.string().min(1, "Date requise"),
  mileage: z.string().refine((val) => {
    if (!val) return true;
    const num = parseInt(val);
    return !isNaN(num) && num >= 0;
  }, "Kilométrage invalide"),
  status: z.string(),
  priority: z.string(),
  cost: z.string().refine((val) => {
    if (!val) return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "Coût invalide"),
  notes: z.string().max(500, "Notes trop longues"),
});

interface MaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance?: any;
  vehicles: any[];
  onSave: () => void;
}

export const MaintenanceDialog = ({ open, onOpenChange, maintenance, vehicles, onSave }: MaintenanceDialogProps) => {
  const [formData, setFormData] = useState({
    vehicle_id: "",
    type: "",
    date: "",
    mileage: "",
    status: "scheduled",
    priority: "medium",
    cost: "",
    notes: "",
  });

  useEffect(() => {
    if (maintenance) {
      setFormData({
        vehicle_id: maintenance.vehicle_id || "",
        type: maintenance.type || "",
        date: maintenance.date || "",
        mileage: maintenance.mileage?.toString() || "",
        status: maintenance.status || "scheduled",
        priority: maintenance.priority || "medium",
        cost: maintenance.cost?.toString() || "",
        notes: maintenance.notes || "",
      });
    } else {
      setFormData({
        vehicle_id: "",
        type: "",
        date: "",
        mileage: "",
        status: "scheduled",
        priority: "medium",
        cost: "",
        notes: "",
      });
    }
  }, [maintenance, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = maintenanceSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    try {
      const dataToSave = {
        vehicle_id: formData.vehicle_id,
        type: formData.type,
        date: formData.date,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        status: formData.status,
        priority: formData.priority,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        notes: formData.notes || null,
      };

      if (maintenance) {
        const { error } = await supabase
          .from("maintenance_records")
          .update(dataToSave)
          .eq("id", maintenance.id);

        if (error) throw error;
        toast.success("Maintenance mise à jour avec succès");
      } else {
        const { error } = await supabase
          .from("maintenance_records")
          .insert([dataToSave]);

        if (error) throw error;
        toast.success("Maintenance ajoutée avec succès");
      }

      onSave();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving maintenance:", error);
      toast.error(error.message || "Erreur lors de l'enregistrement");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {maintenance ? "Modifier la maintenance" : "Nouvelle maintenance"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle_id">Véhicule *</Label>
            <Select value={formData.vehicle_id} onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}>
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

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="Ex: Révision, Vidange, Contrôle technique..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Kilométrage</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                placeholder="Ex: 50000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Planifié</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Coût (€)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="Ex: 450.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes additionnelles..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="gradient-primary border-0">
              {maintenance ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
