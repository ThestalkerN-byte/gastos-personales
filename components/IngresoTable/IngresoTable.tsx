"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { getIngresosByFilters } from "@/app/_actions/ingreso/actions";
import { getCategorias } from "@/app/_actions/categorias/actions";
import { Ingreso } from "@/core/domain/entities/Ingreso";
import { Categoria } from "@/core/domain/entities/Categorias";
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

export function IngresoTable() {
  const { user } = useUser();
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [categoriaId, setCategoriaId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [ingresosData, categoriasData] = await Promise.all([
        getIngresosByFilters({
          usuario_id: user.id,
          mes,
          anio,
          categoria_id: categoriaId !== "all" ? categoriaId : undefined,
        }),
        getCategorias(),
      ]);
      setIngresos(ingresosData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setIngresos([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, mes, anio, categoriaId]);

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

  const total = ingresos.reduce((acc, i) => acc + (i.monto ?? 0), 0);

  return (
    <div className="space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="mes-ingreso">Mes</Label>
            <Select value={String(mes)} onValueChange={(v) => setMes(Number(v))}>
              <SelectTrigger id="mes-ingreso" className="w-[140px]">
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
            <Label htmlFor="anio-ingreso">Año</Label>
            <Select value={String(anio)} onValueChange={(v) => setAnio(Number(v))}>
              <SelectTrigger id="anio-ingreso" className="w-[100px]">
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
            <Label htmlFor="categoria-ingreso">Categoría</Label>
            <Select value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger id="categoria-ingreso" className="w-[180px]">
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
              Ingresos de {MESES.find((m) => m.valor === mes)?.nombre} {anio}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingresos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-8"
                  >
                    No hay ingresos para los filtros seleccionados.
                  </TableCell>
                </TableRow>
              ) : (
                ingresos.map((ingreso) => (
                  <TableRow key={ingreso.id}>
                    <TableCell className="font-medium">
                      {ingreso.descripcion || "—"}
                    </TableCell>
                    <TableCell>
                      {getCategoriaNombre(ingreso.categoria_id)}
                    </TableCell>
                    <TableCell>
                      {ingreso.createdAt
                        ? formatearFecha(ingreso.createdAt)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatearMonto(ingreso.monto)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="font-medium">
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
  );
}
