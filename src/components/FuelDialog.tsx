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

const fuelSchema = z.object({
  vehicle_id: z.string().uuid({ message: "Véhicule requis" }),
  driver_id: z.string().uuid().optional().or(z.literal("")),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date invalide" }),
  mileage: z.number().int().min(0, { message: "Le kilométrage doit être positif" }).max(9999999, { message: "Kilométrage trop élevé" }),
  liters: z.number().min(0.01, { message: "Les litres doivent être supérieurs à 0" }).max(1000, { message: "Litres trop élevés" }),
  cost: z.number().min(0, { message: "Le coût doit être positif" }).max(999999, { message: "Coût trop élevé" }),
  station: z.string().trim().max(100, { message: "Station trop longue" }).optional().or(z.literal("")),
  consumption: z.number().min(0).max(100).optional().or(z.literal(0)),
  notes: z.string().trim().max(500, { message: "Notes trop longues (max 500 caractères)" }).optional().or(z.literal("")),
});

interface FuelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fuelRecord: any;
  vehicles: any[];
  drivers: any[];
  onSave: () => void;
}

export const FuelDialog = ({ open, onOpenChange, fuelRecord, vehicles, drivers, onSave }: FuelDialogProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    vehicle_id: "",
    driver_id: "",
    date: new Date().toISOString().split('T')[0],
    liters: 0,
    cost: 0,
    mileage: 0,
    station: "",
    consumption: 0,
    notes: "",
  });

  useEffect(() => {
    if (fuelRecord) {
      setFormData({
        vehicle_id: fuelRecord.vehicle_id || "",
        driver_id: fuelRecord.driver_id || "",
        date: fuelRecord.date || new Date().toISOString().split('T')[0],
        liters: fuelRecord.liters || 0,
        cost: fuelRecord.cost || 0,
        mileage: fuelRecord.mileage || 0,
        station: fuelRecord.station || "",
        consumption: fuelRecord.consumption || 0,
        notes: fuelRecord.notes || "",
      });
    } else {
      setFormData({
        vehicle_id: "",
        driver_id: "",
        date: new Date().toISOString().split('T')[0],
        liters: 0,
        cost: 0,
        mileage: 0,
        station: "",
        consumption: 0,
        notes: "",
      });
    }
  }, [fuelRecord]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    try {
      const validatedData = fuelSchema.parse({
        vehicle_id: formData.vehicle_id,
        driver_id: formData.driver_id || undefined,
        date: formData.date,
        mileage: parseInt(formData.mileage.toString()),
        liters: parseFloat(formData.liters.toString()),
        cost: parseFloat(formData.cost.toString()),
        station: formData.station || undefined,
        consumption: formData.consumption ? parseFloat(formData.consumption.toString()) : undefined,
        notes: formData.notes || undefined,
      });

      const dataToSave = {
        vehicle_id: validatedData.vehicle_id,
        date: validatedData.date,
        mileage: validatedData.mileage,
        liters: validatedData.liters,
        cost: validatedData.cost,
        driver_id: validatedData.driver_id || null,
        station: validatedData.station || null,
        consumption: validatedData.consumption || null,
        notes: validatedData.notes || null,
        user_id: user.id,
      };

      if (fuelRecord) {
        const { error } = await supabase
          .from("fuel_records")
          .update(dataToSave)
          .eq("id", fuelRecord.id);

        if (error) throw error;
        toast.success("Plein modifié avec succès");
      } else {
        const { error } = await supabase.from("fuel_records").insert([dataToSave]);

        if (error) throw error;
        toast.success("Plein ajouté avec succès");
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
            {fuelRecord ? "Modifier le plein" : "Ajouter un plein"}
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
              <Label htmlFor="driver_id">Conducteur</Label>
              <Select
                value={formData.driver_id}
                onValueChange={(value) => setFormData({ ...formData, driver_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Aucun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="mileage">Kilométrage *</Label>
              <Input
                id="mileage"
                type="number"
                required
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="liters">Litres *</Label>
              <Input
                id="liters"
                type="number"
                step="0.01"
                required
                value={formData.liters}
                onChange={(e) => setFormData({ ...formData, liters: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="cost">Coût (€) *</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                required
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="consumption">Consommation (L/100km)</Label>
              <Input
                id="consumption"
                type="number"
                step="0.1"
                value={formData.consumption}
                onChange={(e) => setFormData({ ...formData, consumption: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="station">Station</Label>
            <Input
              id="station"
              value={formData.station}
              onChange={(e) => setFormData({ ...formData, station: e.target.value })}
            />
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
              {fuelRecord ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
