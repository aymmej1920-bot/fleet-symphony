import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: any;
  vehicles: any[];
  onSave: () => void;
}

export const DriverDialog = ({ open, onOpenChange, driver, vehicles, onSave }: DriverDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    license_number: "",
    license_expiry: "",
    status: "available",
    assigned_vehicle_id: "",
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || "",
        email: driver.email || "",
        phone: driver.phone || "",
        license_number: driver.license_number || "",
        license_expiry: driver.license_expiry || "",
        status: driver.status || "available",
        assigned_vehicle_id: driver.assigned_vehicle_id || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        license_number: "",
        license_expiry: "",
        status: "available",
        assigned_vehicle_id: "",
      });
    }
  }, [driver]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataToSave = {
        ...formData,
        assigned_vehicle_id: formData.assigned_vehicle_id || null,
      };

      if (driver) {
        const { error } = await supabase
          .from("drivers")
          .update(dataToSave)
          .eq("id", driver.id);

        if (error) throw error;
        toast.success("Conducteur modifié avec succès");
      } else {
        const { error } = await supabase.from("drivers").insert([dataToSave]);

        if (error) throw error;
        toast.success("Conducteur ajouté avec succès");
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
            {driver ? "Modifier le conducteur" : "Ajouter un conducteur"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="license_number">Numéro de permis *</Label>
              <Input
                id="license_number"
                required
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="license_expiry">Expiration permis</Label>
              <Input
                id="license_expiry"
                type="date"
                value={formData.license_expiry}
                onChange={(e) => setFormData({ ...formData, license_expiry: e.target.value })}
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
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="on-route">En tournée</SelectItem>
                  <SelectItem value="off-duty">Hors service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assigned_vehicle_id">Véhicule assigné</Label>
              <Select
                value={formData.assigned_vehicle_id}
                onValueChange={(value) => setFormData({ ...formData, assigned_vehicle_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Aucun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} - {vehicle.plate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="gradient-primary border-0">
              {driver ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
