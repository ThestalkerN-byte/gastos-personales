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
import {
  MetaAhorro,
} from "@/core/domain/entities/MetaAhorro";
import { addContribucionMetaAhorroAction } from "@/app/_actions/meta-ahorro/actions";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { z } from "zod";

const ContribucionFormSchema = z.object({
  monto: z.coerce.number().refine((v) => v !== 0, "El monto no puede ser cero"),
  descripcion: z.string().max(500).optional(),
});

type ContribucionFormInput = z.infer<typeof ContribucionFormSchema>;

interface ContribucionFormModalProps {
  meta: MetaAhorro;
  onSuccess?: () => void;
}

export function ContribucionFormModal({ meta, onSuccess }: ContribucionFormModalProps) {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<"deposito" | "retiro">("deposito");
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContribucionFormInput>({
    resolver: zodResolver(ContribucionFormSchema),
    defaultValues: { monto: 0, descripcion: "" },
  });

  if (!user?.id) return null;

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-1 h-4 w-4" />
          Contribuir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Contribuir a {meta.nombre}
          </DialogTitle>
          <DialogDescription>
            Saldo actual: ${meta.monto_actual.toLocaleString("es-AR")}. 
            {tipo === "retiro" && meta.monto_actual <= 0 && " No hay saldo para retirar."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(async (data) => {
            if (!user?.id) return;
            const monto = tipo === "retiro" ? -Math.abs(data.monto) : Math.abs(data.monto);
            const formData = new FormData();
            formData.append("meta_ahorro_id", meta.id);
            formData.append("usuario_id", user.id);
            formData.append("monto", String(monto));
            if (data.descripcion) formData.append("descripcion", data.descripcion);

            const result = await addContribucionMetaAhorroAction(formData);
            if (result?.success) {
              toast.success("Contribución registrada");
              reset();
              setOpen(false);
              onSuccess?.();
            } else {
              toast.error(result?.message ?? "Error");
            }
          })}
          className="space-y-4"
        >
          <div className="flex gap-2">
            <Button
              type="button"
              variant={tipo === "deposito" ? "default" : "outline"}
              size="sm"
              onClick={() => setTipo("deposito")}
            >
              Depósito
            </Button>
            <Button
              type="button"
              variant={tipo === "retiro" ? "default" : "outline"}
              size="sm"
              onClick={() => setTipo("retiro")}
              disabled={meta.monto_actual <= 0}
            >
              Retiro
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monto">Monto</Label>
            <Input
              id="monto"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0"
              {...register("monto")}
            />
            {errors.monto && (
              <p className="text-sm text-destructive">{errors.monto.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Input id="descripcion" placeholder="Ej: Sueldo marzo" {...register("descripcion")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
