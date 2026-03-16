"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TarjetaInput, TarjetaSchema } from "@/core/domain/schemas/tarjeta.schema";
import { useUser } from "@/context/UserContext";
import { createTarjetaAction } from "@/app/_actions/tarjetas/actions";
import { toast } from "sonner";

interface TarjetaFormModalProps {
  onSuccess?: () => void;
}

export function TarjetaFormModal({ onSuccess }: TarjetaFormModalProps) {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TarjetaInput>({
    resolver: zodResolver(TarjetaSchema),
    defaultValues: {
      usuario_id: user?.id ?? "",
      nombre: "",
    },
  });

  if (!user?.id) {
    return <p className="text-sm text-destructive">Cargando usuario...</p>;
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarjeta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Tarjeta</DialogTitle>
          <DialogDescription>
            Completa los campos para registrar una nueva tarjeta.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(async (data) => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                formData.append(key, String(value));
              }
            });

            const result = await createTarjetaAction(formData);
            if (result?.success) {
              toast.success("Tarjeta creada correctamente");
              reset();
              setOpen(false);
              onSuccess?.();
            } else {
              toast.error(result?.message ?? "Error al crear tarjeta");
            }
          })}
          className="space-y-4"
        >
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Tarjeta</Label>
            <Input
              id="nombre"
              placeholder="Ej: Visa Personal, Mastercard Empresa"
              {...register("nombre")}
            />
            {errors.nombre && (
              <p className="text-sm text-destructive">
                {errors.nombre.message}
              </p>
            )}
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <Label>Tipo de Tarjeta</Label>
            <Controller
              name="tipo"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona el tipo de tarjeta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credito">Crédito</SelectItem>
                    <SelectItem value="debito">Débito</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipo && (
              <p className="text-sm text-destructive">
                {errors.tipo.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Tarjeta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
