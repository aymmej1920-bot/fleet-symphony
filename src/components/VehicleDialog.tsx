import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const vehicleSchema = z.object({
  brand: z.string().trim().min(1, "Marque requise").max(50, "Marque trop longue"),
  model: z.string().trim().min(1, "Modèle requis").max(50, "Modèle trop long"),
  plate: z.string().trim().min(1, "Plaque requise").max(20, "Plaque trop longue"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1, "Année invalide"),
  status: z.string(),
  mileage: z.number().min(0, "Kilométrage invalide"),
  fuel_level: z.number().min(0).max(100, "Niveau doit être entre 0 et 100"),
  next_maintenance_date: z.string().optional(),
});

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: any;
  onSave: () => void;
}

export const VehicleDialog = ({ open, onOpenChange, vehicle, onSave }: VehicleDialogProps) => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    plate: "",
    year: new Date().getFullYear(),
    status: "active",
    mileage: 0,
    fuel_level: 100,
    next_maintenance_date: "",
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        brand: vehicle.brand || "",
        model: vehicle.model || "",
        plate: vehicle.plate || "",
        year: vehicle.year || new Date().getFullYear(),
        status: vehicle.status || "active",
        mileage: vehicle.mileage || 0,
        fuel_level: vehicle.fuel_level || 100,
        next_maintenance_date: vehicle.next_maintenance_date || "",
      });
    } else {
      setFormData({
        brand: "",
        model: "",
        plate: "",
        year: new Date().getFullYear(),
        status: "active",
        mileage: 0,
        fuel_level: 100,
        next_maintenance_date: "",
      });
    }
  }, [vehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = vehicleSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    
    try {
      if (vehicle) {
        const { error } = await supabase
          .from("vehicles")
          .update(formData)
          .eq("id", vehicle.id);

        if (error) throw error;
        toast.success("Véhicule modifié avec succès");
      } else {
        const { error } = await supabase.from("vehicles").insert([formData]);

        if (error) throw error;
        toast.success("Véhicule ajouté avec succès");
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
            {vehicle ? "Modifier le véhicule" : "Ajouter un véhicule"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Marque *</Label>
              <Input
                id="brand"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="model">Modèle *</Label>
              <Input
                id="model"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plate">Immatriculation *</Label>
              <Input
                id="plate"
                required
                value={formData.plate}
                onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="year">Année</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="maintenance">En maintenance</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mileage">Kilométrage</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fuel_level">Niveau de carburant (%)</Label>
              <Input
                id="fuel_level"
                type="number"
                min="0"
                max="100"
                value={formData.fuel_level}
                onChange={(e) => setFormData({ ...formData, fuel_level: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="next_maintenance_date">Prochaine maintenance</Label>
              <Input
                id="next_maintenance_date"
                type="date"
                value={formData.next_maintenance_date}
                onChange={(e) => setFormData({ ...formData, next_maintenance_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="gradient-primary border-0">
              {vehicle ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
