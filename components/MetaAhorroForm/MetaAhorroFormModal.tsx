"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MetaAhorroInput, MetaAhorroSchema } from "@/core/domain/schemas/meta-ahorro.schema";
import { useUser } from "@/context/UserContext";
import { createMetaAhorroAction } from "@/app/_actions/meta-ahorro/actions";
import { toast } from "sonner";

interface MetaAhorroFormModalProps {
  onSuccess?: () => void;
}

export function MetaAhorroFormModal({ onSuccess }: MetaAhorroFormModalProps) {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MetaAhorroInput>({
    resolver: zodResolver(MetaAhorroSchema),
    defaultValues: {
      usuario_id: user?.id ?? "",
      nombre: "",
      monto_objetivo: 0,
      descripcion: "",
    },
  });

  if (!user?.id) {
    return null;
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-5" />
          Nueva meta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Nueva meta de ahorro
          </DialogTitle>
          <DialogDescription>
            Define una meta para ahorrar. Luego podrás agregar contribuciones para alcanzarla.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(async (data) => {
            const formData = new FormData();
            formData.append("nombre", data.nombre);
            formData.append("monto_objetivo", String(data.monto_objetivo));
            formData.append("usuario_id", user.id!);
            if (data.descripcion) formData.append("descripcion", data.descripcion);

            const result = await createMetaAhorroAction(formData);
            if (result?.success) {
              toast.success("Meta de ahorro creada");
              reset();
              setOpen(false);
              onSuccess?.();
            } else {
              toast.error(result?.message ?? "Error al crear meta");
            }
          })}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la meta</Label>
            <Input
              id="nombre"
              placeholder="Ej: Vacaciones, Emergencias, Auto"
              {...register("nombre")}
            />
            {errors.nombre && (
              <p className="text-sm text-destructive">{errors.nombre.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="monto_objetivo">Monto objetivo</Label>
            <Input
              id="monto_objetivo"
              type="number"
              min="1"
              step="0.01"
              placeholder="150000"
              {...register("monto_objetivo")}
            />
            {errors.monto_objetivo && (
              <p className="text-sm text-destructive">{errors.monto_objetivo.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Input
              id="descripcion"
              placeholder="Breve descripción"
              {...register("descripcion")}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear meta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
