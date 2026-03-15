"use client";

import { useState, useCallback } from "react";
import { Wallet } from "lucide-react";
import { IngresoFormModal } from "@/components/IngresoForm/IngresoForm";
import { IngresoTable } from "@/components/IngresoTable/IngresoTable";

interface IngresosModuleProps {
  onDataChanged?: () => void;
}

/**
 * Módulo de Ingresos: integra formulario y tabla en una sección visual cohesiva.
 * Conecta el flujo crear ingreso → refrescar listado y resumen.
 */
export function IngresosModule({ onDataChanged }: IngresosModuleProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleIngresoCreated = useCallback(() => {
    setRefreshKey((k) => k + 1);
    onDataChanged?.();
  }, [onDataChanged]);

  return (
    <section
      id="ingresos"
      className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm"
      aria-labelledby="ingresos-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="ingresos-heading"
              className="text-lg font-semibold text-card-foreground"
            >
              Ingresos
            </h2>
            <p className="text-sm text-muted-foreground">
              Registra sueldos, freelance, ventas y otros ingresos
            </p>
          </div>
        </div>
        <IngresoFormModal onSuccess={handleIngresoCreated} />
      </div>

      <IngresoTable key={refreshKey} />
    </section>
  );
}
