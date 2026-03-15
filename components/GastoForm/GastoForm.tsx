"use client";

import { useEffect, useState } from "react";
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
import { GastoInput, GastoSchema } from "@/core/domain/schemas/gasto.schema";
import { useUser } from "@/context/UserContext";
import { getCategorias } from "@/app/_actions/categorias/actions";
import { Categoria } from "@/core/domain/entities/Categorias";
import { Tarjeta } from "@/core/domain/entities/Tarjeta";
import { getTarjetas } from "@/app/_actions/tarjetas/actions";
import { createGastoAction } from "@/app/_actions/gasto/actions";
import { toast } from "sonner";

interface GastoFormModalProps {
  onSuccess?: () => void;
}

export function GastoFormModal({ onSuccess }: GastoFormModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedTarjeta, setSelectedTarjeta] = useState<string | undefined>();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const { user } = useUser();
  const tarjetaSeleccionada = tarjetas.find((t) => t.id === selectedTarjeta);
  const esDebito = tarjetaSeleccionada?.tipo === "debito";

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GastoInput>({
    resolver: zodResolver(GastoSchema),
    defaultValues: {
      usuario_id: user?.id ?? "",
      categoria_id: "",
    },
  });

  // funciones de carga reutilizables
  const loadTarjetas = async () => {
    try {
      if (!user?.id) return;
      const data = await getTarjetas(user.id);
      setTarjetas(data);
    } catch (error) {
      console.error("Error cargando tarjetas:", error);
    }
  };

  const loadCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
      // Setear categoría por defecto "sin especificar" si existe
      const categoriaSinEspecificar = data.find((cat) => cat.nombre === "sin especificar");
      if (categoriaSinEspecificar) {
        setValue("categoria_id", categoriaSinEspecificar.id);
      }
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  // Cargar al montar
  useEffect(() => {
    loadCategorias();
    loadTarjetas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Si el usuario no está cargado, no renderizar el formulario
  if (!user?.id) {
    return <p className="text-sm text-destructive">Cargando usuario...</p>;
  }

  const handleTarjetaChange = (value: string) => {
    if (value === "none") {
      setSelectedTarjeta(undefined);
      setValue("tarjeta_id", undefined);
      setValue("cantidad_cuotas", undefined);
    } else {
      setSelectedTarjeta(value);
      setValue("tarjeta_id", value);
      // Si es debito, limpiar cuotas
      const tarjeta = tarjetas.find((t) => t.id === value);
      if (tarjeta?.tipo === "debito") {
        setValue("cantidad_cuotas", undefined);
      }
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Al abrir el modal, refrescar las tarjetas para incluir nuevas creadas
      loadTarjetas();
    } else {
      reset();
      setSelectedTarjeta(undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Gasto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Gasto</DialogTitle>
          <DialogDescription>
            Completa los campos para registrar un nuevo gasto.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(async (data) => {
            // data viene validado por Zod vía zodResolver
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                formData.append(key, String(value));
              }
            });

            const result = await createGastoAction(formData);
            if (result?.success) {
              toast.success("Gasto registrado correctamente");
              reset();
              setSelectedTarjeta(undefined);
              setOpen(false);
              onSuccess?.();
            } else {
              toast.error(result?.message ?? "Error al crear gasto");
            }
          })}
          className="space-y-4"
        >
          {/* Motivo */}
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo</Label>
            <Input
              id="motivo"
              placeholder="Descripcion del gasto"
              {...register("motivo")}
            />
            {errors.motivo && (
              <p className="text-sm text-destructive">
                {errors.motivo.message}
              </p>
            )}
          </div>

          {/* Monto */}
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

          {/* Categoria */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Controller
              name="categoria_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una categoria" />
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

          {/* Tarjeta (opcional) */}
          <div className="space-y-2">
            <Label>Tarjeta (opcional)</Label>
            <Select
              onValueChange={handleTarjetaChange}
              value={selectedTarjeta || "none"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sin tarjeta asociada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin tarjeta asociada</SelectItem>
                {tarjetas.map((tarjeta) => (
                  <SelectItem key={tarjeta.id} value={tarjeta.id}>
                    {tarjeta.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cantidad de cuotas - solo si hay tarjeta de credito seleccionada */}
          {selectedTarjeta && !esDebito && (
            <div className="space-y-2">
              <Label htmlFor="cantidad_cuotas">Cantidad de Cuotas</Label>
              <Select
                onValueChange={(value) =>
                  setValue("cantidad_cuotas", parseInt(value))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona las cuotas" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 6, 9, 12, 18, 24].map((cuota) => (
                    <SelectItem key={cuota} value={cuota.toString()}>
                      {cuota} {cuota === 1 ? "cuota" : "cuotas"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cantidad_cuotas && (
                <p className="text-sm text-destructive">
                  {errors.cantidad_cuotas.message}
                </p>
              )}
            </div>
          )}

          {/* Info de debito */}
          {esDebito && (
            <p className="text-sm text-muted-foreground">
              Las tarjetas de debito no permiten cuotas.
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Gasto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
