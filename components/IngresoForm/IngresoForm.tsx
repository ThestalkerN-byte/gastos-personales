"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Wallet } from "lucide-react";

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
import { IngresoInput, IngresoSchema } from "@/core/domain/schemas/ingreso.schema";
import { useUser } from "@/context/UserContext";
import { getCategorias } from "@/app/_actions/categorias/actions";
import { Categoria } from "@/core/domain/entities/Categorias";
import { createIngresoAction } from "@/app/_actions/ingreso/actions";
import { toast } from "sonner";

interface IngresoFormModalProps {
  onSuccess?: () => void;
}

export function IngresoFormModal({ onSuccess }: IngresoFormModalProps) {
  const [open, setOpen] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IngresoInput>({
    resolver: zodResolver(IngresoSchema),
    defaultValues: {
      usuario_id: user?.id ?? "",
      categoria_id: "",
    },
  });

  const loadCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      loadCategorias();
      setValue("usuario_id", user?.id ?? "");
    } else {
      reset();
    }
  };

  if (!user?.id) {
    return <p className="text-sm text-destructive">Cargando usuario...</p>;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wallet className="mr-2 h-4 w-4" />
          Nuevo Ingreso
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Ingreso</DialogTitle>
          <DialogDescription>
            Registra un ingreso (sueldo, freelance, venta, etc.)
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

            const result = await createIngresoAction(formData);
            if (result?.success) {
              toast.success("Ingreso registrado correctamente");
              reset();
              setOpen(false);
              onSuccess?.();
            } else {
              toast.error(result?.message ?? "Error al crear ingreso");
            }
          })}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="monto">Monto</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("monto", { valueAsNumber: true })}
            />
            {errors.monto && (
              <p className="text-sm text-destructive">{errors.monto.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Categoría</Label>
            <Controller
              name="categoria_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoria_id && (
              <p className="text-sm text-destructive">
                {errors.categoria_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Input
              id="descripcion"
              placeholder="Ej: Sueldo marzo, freelance proyecto X"
              {...register("descripcion")}
            />
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
              {isSubmitting ? "Guardando..." : "Guardar Ingreso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
