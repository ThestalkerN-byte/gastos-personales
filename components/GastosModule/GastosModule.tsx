"use client";

import { Receipt } from "lucide-react";
import { GastoFormModal } from "@/components/GastoForm/GastoForm";
import { GastoTable } from "@/components/GastoTable/GastoTable";
import { useState } from "react";

interface GastosModuleProps {
  onDataChanged?: () => void;
}

/**
 * Módulo de Gastos: integra formulario y tabla en una sección visual cohesiva.
 */
export function GastosModule({ onDataChanged }: GastosModuleProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleGastoChange = () => {
    setRefreshKey((k) => k + 1);
    onDataChanged?.();
  };
  return (
    <section
      id="gastos"
      className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm"
      aria-labelledby="gastos-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="gastos-heading"
              className="text-lg font-semibold text-card-foreground"
            >
              Gastos
            </h2>
            <p className="text-sm text-muted-foreground">
              Registra gastos con tarjeta, categoría y cuotas
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <GastoFormModal onSuccess={handleGastoChange} />
        </div>
      </div>

      <GastoTable key={refreshKey} onSuccess={handleGastoChange} />
    </section>
  );
}
