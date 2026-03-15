"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { getGastosByFilters } from "@/app/_actions/gasto/actions";
import { getCategorias } from "@/app/_actions/categorias/actions";
import { getTarjetas } from "@/app/_actions/tarjetas/actions";
import { Gasto } from "@/core/domain/entities/Gasto";
import { Categoria } from "@/core/domain/entities/Categorias";
import { Tarjeta } from "@/core/domain/entities/Tarjeta";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { ReembolsoFormModal } from "@/components/ReembolsoForm/ReembolsoForm";

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

function formatearFecha(fecha: string | Date) {
  const d = typeof fecha === "string" ? new Date(fecha) : fecha;
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatearMonto(monto: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(monto);
}

export function GastoTable() {
  const { user } = useUser();
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [tarjetaId, setTarjetaId] = useState<string>("all");
  const [categoriaId, setCategoriaId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [gastosData, categoriasData, tarjetasData] = await Promise.all([
        getGastosByFilters({
          usuario_id: user.id,
          mes,
          anio,
          tarjeta_id: tarjetaId && tarjetaId !== "all" ? tarjetaId : undefined,
          categoria_id: categoriaId && categoriaId !== "all" ? categoriaId : undefined,
        }),
        getCategorias(),
        getTarjetas(user.id),
      ]);
      setGastos(gastosData);
      setCategorias(categoriasData);
      setTarjetas(tarjetasData);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setGastos([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, mes, anio, tarjetaId, categoriaId]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  if (!user?.id) {
    return (
      <p className="text-sm text-destructive">Cargando usuario...</p>
    );
  }

  const getCategoriaNombre = (id: string) =>
    categorias.find((c) => c.id === id)?.nombre ?? id;
  const getTarjetaNombre = (id: string) =>
    tarjetas.find((t) => t.id === id)?.nombre ?? "Sin tarjeta";

  const total = gastos.reduce((acc, g) => acc + (g.monto ?? 0), 0);

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-card-foreground mb-4">
        Gastos por mes
      </h2>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="mes">Mes</Label>
            <Select value={String(mes)} onValueChange={(v) => setMes(Number(v))}>
              <SelectTrigger id="mes" className="w-[140px]">
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
            <Label htmlFor="anio">Año</Label>
            <Select value={String(anio)} onValueChange={(v) => setAnio(Number(v))}>
              <SelectTrigger id="anio" className="w-[100px]">
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

          <div className="space-y-2">
            <Label htmlFor="tarjeta">Tarjeta</Label>
            <Select value={tarjetaId} onValueChange={setTarjetaId}>
              <SelectTrigger id="tarjeta" className="w-[180px]">
                <SelectValue placeholder="Todas las tarjetas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las tarjetas</SelectItem>
                {tarjetas.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoría</Label>
            <Select value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger id="categoria" className="w-[180px]">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categorias.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="sm" onClick={cargarDatos}>
            Actualizar
          </Button>
        </div>

        {loading ? (
          <Skeleton className="h-[200px] w-full rounded-md" />
        ) : (
          <Table>
            <TableCaption>
              Gastos de {MESES.find((m) => m.valor === mes)?.nombre} {anio}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Motivo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Tarjeta</TableHead>
                <TableHead>Cuotas</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gastos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No hay gastos para los filtros seleccionados.
                  </TableCell>
                </TableRow>
              ) : (
                gastos.map((gasto) => (
                  <TableRow key={gasto.id}>
                    <TableCell className="font-medium">{gasto.motivo}</TableCell>
                    <TableCell>{getCategoriaNombre(gasto.categoria_id)}</TableCell>
                    <TableCell>
                      {gasto.tarjeta_id
                        ? getTarjetaNombre(gasto.tarjeta_id)
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {gasto.cantidad_cuotas ?? "—"}
                    </TableCell>
                    <TableCell>
                      {gasto.createdAt
                        ? formatearFecha(gasto.createdAt)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatearMonto(gasto.monto)}
                    </TableCell>
                    <TableCell>
                      <ReembolsoFormModal
                        gastoId={gasto.id}
                        gastoMotivo={gasto.motivo}
                        gastoMonto={gasto.monto}
                        onSuccess={cargarDatos}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} className="font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatearMonto(total)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>
    </div>
  );
}
