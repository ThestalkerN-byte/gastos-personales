"use client";

import { MetaAhorro } from "@/core/domain/entities/MetaAhorro";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContribucionFormModal } from "@/components/ContribucionForm/ContribucionFormModal";
import { DeleteMetaAhorroForm } from "@/components/DeleteMetaAhorroForm/DeleteMetaAhorroForm";
import { PiggyBank, Trash } from "lucide-react";

interface MetaAhorroCardProps {
  meta: MetaAhorro;
  onDataChanged?: () => void;
}

function formatearMonto(monto: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(monto);
}

export function MetaAhorroCard({ meta, onDataChanged }: MetaAhorroCardProps) {
  const porcentaje = meta.monto_objetivo > 0
    ? Math.min(100, (meta.monto_actual / meta.monto_objetivo) * 100)
    : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <PiggyBank className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{meta.nombre}</h3>
              {meta.descripcion && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {meta.descripcion}
                </p>
              )}
            </div>
          </div>
          <DeleteMetaAhorroForm meta={meta} onSuccess={onDataChanged} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium">
              {formatearMonto(meta.monto_actual)} / {formatearMonto(meta.monto_objetivo)}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {porcentaje.toFixed(0)}% completado
          </p>
        </div>
        <ContribucionFormModal meta={meta} onSuccess={onDataChanged} />
      </CardContent>
    </Card>
  );
}
