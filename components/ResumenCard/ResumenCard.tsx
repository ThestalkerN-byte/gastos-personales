"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { getResumenMensual } from "@/app/_actions/resumen/actions";
import { TrendingUp, TrendingDown, Wallet, Receipt, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const MESES = [
  { valor: 1, nombre: "Enero" },
  { valor: 2, nombre: "Febrero" },
  { valor: 3, nombre: "Marzo" },
  { valor: 4, nombre: "Abril" },
  { valor: 5, nombre: "Mayo" },
  { valor: 6, nombre: "Junio" },
  { valor: 7, nombre: "Julio" },
  { valor: 8, nombre: "Agosto" },
  { valor: 9, nombre: "Septiembre" },
  { valor: 10, nombre: "Octubre" },
  { valor: 11, nombre: "Noviembre" },
  { valor: 12, nombre: "Diciembre" },
];

const anios = Array.from(
  { length: 6 },
  (_, i) => new Date().getFullYear() - i
);

function formatearMonto(monto: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(monto);
}

interface ResumenCardProps {
  refreshKey?: number;
}

export function ResumenCard({ refreshKey = 0 }: ResumenCardProps) {
  const { user } = useUser();
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<{
    totalIngresos: number;
    totalGastos: number;
    totalReembolsos: number;
    balance: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarResumen = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const resumen = await getResumenMensual({
        usuario_id: user.id,
        mes,
        anio,
      });
      setData(resumen);
    } catch (error) {
      console.error("Error cargando resumen:", error);
      setData({ totalIngresos: 0, totalGastos: 0, totalReembolsos: 0, balance: 0 });
    } finally {
      setLoading(false);
    }
  }, [user?.id, mes, anio, refreshKey]);

  useEffect(() => {
    cargarResumen();
  }, [cargarResumen]);

  if (!user?.id) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-card-foreground">
          Resumen del mes
        </h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label htmlFor="mes-resumen" className="sr-only">
              Mes
            </Label>
            <Select value={String(mes)} onValueChange={(v) => setMes(Number(v))}>
              <SelectTrigger id="mes-resumen" className="w-[140px]">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                {MESES.map((m) => (
                  <SelectItem key={m.valor} value={String(m.valor)}>
                    {m.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="anio-resumen" className="sr-only">
              Año
            </Label>
            <Select value={String(anio)} onValueChange={(v) => setAnio(Number(v))}>
              <SelectTrigger id="anio-resumen" className="w-[100px]">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                {anios.map((a) => (
                  <SelectItem key={a} value={String(a)}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" onClick={cargarResumen}>
            Actualizar
          </Button>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-24 w-full rounded-md" />
      ) : data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total ingresos</p>
              <p className="text-lg font-semibold text-card-foreground">
                {formatearMonto(data.totalIngresos)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total gastos</p>
              <p className="text-lg font-semibold text-card-foreground">
                {formatearMonto(data.totalGastos)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total reembolsos</p>
              <p className="text-lg font-semibold text-card-foreground">
                {formatearMonto(data.totalReembolsos)}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-3 rounded-lg border p-4 ${
              data.balance >= 0
                ? "border-green-500/30 bg-green-500/5"
                : "border-destructive/30 bg-destructive/5"
            }`}
          >
            <div
              className={`flex size-10 items-center justify-center rounded-lg ${
                data.balance >= 0 ? "bg-green-500/20 text-green-700 dark:text-green-400" : "bg-destructive/20 text-destructive"
              }`}
            >
              {data.balance >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Balance (ingreso − gasto + reembolsos)
              </p>
              <p
                className={`text-lg font-semibold ${
                  data.balance >= 0 ? "text-green-700 dark:text-green-400" : "text-destructive"
                }`}
              >
                {formatearMonto(data.balance)}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
