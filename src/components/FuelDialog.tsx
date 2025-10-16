import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FuelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fuelRecord: any;
  vehicles: any[];
  drivers: any[];
  onSave: () => void;
}

export const FuelDialog = ({ open, onOpenChange, fuelRecord, vehicles, drivers, onSave }: FuelDialogProps) => {
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

    try {
      const dataToSave = {
        ...formData,
        driver_id: formData.driver_id || null,
        liters: parseFloat(formData.liters.toString()),
        cost: parseFloat(formData.cost.toString()),
        mileage: parseInt(formData.mileage.toString()),
        consumption: formData.consumption ? parseFloat(formData.consumption.toString()) : null,
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
      toast.error(error.message);
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
