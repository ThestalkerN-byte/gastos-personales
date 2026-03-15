"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote } from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReembolsoInput, ReembolsoSchema } from "@/core/domain/schemas/reembolso.schema";
import { Reembolso } from "@/core/domain/entities/Reembolso";
import { useUser } from "@/context/UserContext";
import {
  createReembolsoAction,
  getReembolsosByGastoId,
} from "@/app/_actions/reembolso/actions";

interface ReembolsoFormModalProps {
  gastoId: string;
  gastoMotivo: string;
  gastoMonto: number;
  onSuccess?: () => void;
}

function formatearMonto(monto: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(monto);
}

function formatearFecha(fecha: string | Date) {
  const d = typeof fecha === "string" ? new Date(fecha) : fecha;
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function ReembolsoFormModal({
  gastoId,
  gastoMotivo,
  gastoMonto,
  onSuccess,
}: ReembolsoFormModalProps) {
  const [open, setOpen] = useState(false);
  const [reembolsos, setReembolsos] = useState<Reembolso[]>([]);
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReembolsoInput>({
    resolver: zodResolver(ReembolsoSchema),
    defaultValues: {
      gasto_id: gastoId,
      usuario_id: user?.id ?? "",
    },
  });

  const loadReembolsos = async () => {
    try {
      const data = await getReembolsosByGastoId(gastoId);
      setReembolsos(data);
    } catch (error) {
      console.error("Error cargando reembolsos:", error);
      setReembolsos([]);
    }
  };

  useEffect(() => {
    if (open) {
      loadReembolsos();
      reset({
        gasto_id: gastoId,
        usuario_id: user?.id ?? "",
        monto: undefined,
        de_quien: "",
        descripcion: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, gastoId, user?.id]);

  if (!user?.id) return null;

  const totalReembolsado = reembolsos.reduce((acc, r) => acc + r.monto, 0);
  const pendiente = gastoMonto - totalReembolsado;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-primary">
          <Banknote className="mr-1 h-4 w-4" />
          Reembolso
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Reembolsos — {gastoMotivo}</DialogTitle>
          <DialogDescription>
            Gasto total: {formatearMonto(gastoMonto)}. Registra lo que te han
            devuelto por este gasto compartido.
          </DialogDescription>
        </DialogHeader>

        {reembolsos.length > 0 && (
          <div className="space-y-2">
            <Label>Reembolsos registrados</Label>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>De quién</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reembolsos.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.de_quien || "—"}</TableCell>
                      <TableCell>
                        {r.createdAt ? formatearFecha(r.createdAt) : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatearMonto(r.monto)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-sm text-muted-foreground">
              Total reembolsado: {formatearMonto(totalReembolsado)} · Pendiente:{" "}
              {formatearMonto(pendiente)}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(async (data) => {
            const formData = new FormData();
            formData.append("gasto_id", data.gasto_id);
            formData.append("usuario_id", data.usuario_id);
            formData.append("monto", String(data.monto));
            if (data.de_quien) formData.append("de_quien", data.de_quien);
            if (data.descripcion) formData.append("descripcion", data.descripcion);

            const result = await createReembolsoAction(formData);
            if (result?.success) {
              reset();
              loadReembolsos();
              onSuccess?.();
            } else {
              console.error("Error:", result?.message);
            }
          })}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="monto-reembolso">Monto</Label>
            <Input
              id="monto-reembolso"
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
            <Label htmlFor="de_quien">De quién (opcional)</Label>
            <Input
              id="de_quien"
              placeholder="Ej: María, Pedro"
              {...register("de_quien")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion-reembolso">Descripción (opcional)</Label>
            <Input
              id="descripcion-reembolso"
              placeholder="Ej: Mi parte de la cena"
              {...register("descripcion")}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cerrar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Agregar reembolso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
