import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
  vehicles: any[];
  onSave: () => void;
}

export const DocumentDialog = ({ open, onOpenChange, document, vehicles, onSave }: DocumentDialogProps) => {
  const [formData, setFormData] = useState({
    vehicle_id: "",
    type: "",
    expiry_date: "",
    status: "valid",
    document_url: "",
    notes: "",
  });

  useEffect(() => {
    if (document) {
      setFormData({
        vehicle_id: document.vehicle_id || "",
        type: document.type || "",
        expiry_date: document.expiry_date || "",
        status: document.status || "valid",
        document_url: document.document_url || "",
        notes: document.notes || "",
      });
    } else {
      setFormData({
        vehicle_id: "",
        type: "",
        expiry_date: "",
        status: "valid",
        document_url: "",
        notes: "",
      });
    }
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (document) {
        const { error } = await supabase
          .from("documents")
          .update(formData)
          .eq("id", document.id);

        if (error) throw error;
        toast.success("Document modifié avec succès");
      } else {
        const { error } = await supabase.from("documents").insert([formData]);

        if (error) throw error;
        toast.success("Document ajouté avec succès");
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
            {document ? "Modifier le document" : "Ajouter un document"}
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
              <Label htmlFor="type">Type de document *</Label>
              <Input
                id="type"
                required
                placeholder="Ex: Assurance, Contrôle technique..."
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry_date">Date d'expiration *</Label>
              <Input
                id="expiry_date"
                type="date"
                required
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              />
            </div>
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
                  <SelectItem value="valid">Valide</SelectItem>
                  <SelectItem value="expiring-soon">Expire bientôt</SelectItem>
                  <SelectItem value="expired">Expiré</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="document_url">URL du document</Label>
            <Input
              id="document_url"
              type="url"
              placeholder="https://..."
              value={formData.document_url}
              onChange={(e) => setFormData({ ...formData, document_url: e.target.value })}
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
              {document ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
