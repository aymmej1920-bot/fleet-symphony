import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";

const tourSchema = z.object({
  name: z.string().trim().min(1, { message: "Nom requis" }).max(200, { message: "Nom trop long" }),
  vehicle_id: z.string().uuid().optional().or(z.literal("")),
  driver_id: z.string().uuid().optional().or(z.literal("")),
  status: z.enum(["scheduled", "in-progress", "completed"], { message: "Statut invalide" }),
  start_time: z.string().optional().or(z.literal("")),
  end_time: z.string().optional().or(z.literal("")),
  total_stops: z.number().int().min(0, { message: "Nombre d'arrêts invalide" }).max(1000),
  completed_stops: z.number().int().min(0, { message: "Arrêts terminés invalide" }).max(1000),
  distance_km: z.number().min(0).max(99999).optional().or(z.literal(0)),
});

interface TourDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tour: any;
  vehicles: any[];
  drivers: any[];
  onSave: () => void;
}

export const TourDialog = ({ open, onOpenChange, tour, vehicles, drivers, onSave }: TourDialogProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    vehicle_id: "",
    driver_id: "",
    status: "scheduled",
    start_time: "",
    end_time: "",
    total_stops: 0,
    completed_stops: 0,
    distance_km: 0,
  });

  useEffect(() => {
    if (tour) {
      setFormData({
        name: tour.name || "",
        vehicle_id: tour.vehicle_id || "",
        driver_id: tour.driver_id || "",
        status: tour.status || "scheduled",
        start_time: tour.start_time || "",
        end_time: tour.end_time || "",
        total_stops: tour.total_stops || 0,
        completed_stops: tour.completed_stops || 0,
        distance_km: tour.distance_km || 0,
      });
    } else {
      setFormData({
        name: "",
        vehicle_id: "",
        driver_id: "",
        status: "scheduled",
        start_time: "",
        end_time: "",
        total_stops: 0,
        completed_stops: 0,
        distance_km: 0,
      });
    }
  }, [tour]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    try {
      const validatedData = tourSchema.parse({
        name: formData.name,
        vehicle_id: formData.vehicle_id || undefined,
        driver_id: formData.driver_id || undefined,
        status: formData.status,
        start_time: formData.start_time || undefined,
        end_time: formData.end_time || undefined,
        total_stops: parseInt(formData.total_stops.toString()),
        completed_stops: parseInt(formData.completed_stops.toString()),
        distance_km: formData.distance_km ? parseFloat(formData.distance_km.toString()) : undefined,
      });

      const dataToSave = {
        name: validatedData.name,
        status: validatedData.status,
        total_stops: validatedData.total_stops,
        completed_stops: validatedData.completed_stops,
        vehicle_id: validatedData.vehicle_id || null,
        driver_id: validatedData.driver_id || null,
        start_time: validatedData.start_time || null,
        end_time: validatedData.end_time || null,
        distance_km: validatedData.distance_km || null,
        user_id: user.id,
      };

      if (tour) {
        const { error } = await supabase
          .from("tours")
          .update(dataToSave)
          .eq("id", tour.id);

        if (error) throw error;
        toast.success("Tournée modifiée avec succès");
      } else {
        const { error } = await supabase.from("tours").insert([dataToSave]);

        if (error) throw error;
        toast.success("Tournée ajoutée avec succès");
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
            {tour ? "Modifier la tournée" : "Nouvelle tournée"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de la tournée *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle_id">Véhicule</Label>
              <Select
                value={formData.vehicle_id}
                onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}
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
                  <SelectItem value="scheduled">Planifiée</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="total_stops">Nombre d'arrêts</Label>
              <Input
                id="total_stops"
                type="number"
                value={formData.total_stops}
                onChange={(e) => setFormData({ ...formData, total_stops: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="completed_stops">Arrêts terminés</Label>
              <Input
                id="completed_stops"
                type="number"
                value={formData.completed_stops}
                onChange={(e) => setFormData({ ...formData, completed_stops: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="start_time">Heure de début</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end_time">Heure de fin</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="distance_km">Distance (km)</Label>
              <Input
                id="distance_km"
                type="number"
                step="0.1"
                value={formData.distance_km}
                onChange={(e) => setFormData({ ...formData, distance_km: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="gradient-primary border-0">
              {tour ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
