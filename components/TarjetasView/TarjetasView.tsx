"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { getTarjetas } from "@/app/_actions/tarjetas/actions";
import { Tarjeta } from "@/core/domain/entities/Tarjeta";
import { TarjetaCard } from "@/components/TarjetaCard/TarjetaCard";
import { TarjetaFormModal } from "@/components/TarjetaForm/TarjetaForm";
import { GastoTable } from "@/components/GastoTable/GastoTable";
import { CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function TarjetasView() {
  const { user } = useUser();
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [selectedTarjetaId, setSelectedTarjetaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarTarjetas = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await getTarjetas(user.id);
      setTarjetas(data);
      setSelectedTarjetaId((prev) => {
        if (data.length > 0 && !prev) return data[0].id;
        if (prev && !data.find((t) => t.id === prev)) return data[0]?.id ?? null;
        return prev;
      });
    } catch (error) {
      console.error("Error cargando tarjetas:", error);
      setTarjetas([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    cargarTarjetas();
  }, [cargarTarjetas]);

  if (!user?.id) {
    return (
      <p className="text-sm text-destructive">Cargando usuario...</p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section
        id="tarjetas"
        className="rounded-lg border border-border bg-card p-6 shadow-sm"
        aria-labelledby="tarjetas-heading"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h1
                id="tarjetas-heading"
                className="text-xl font-semibold text-card-foreground"
              >
                Mis tarjetas
              </h1>
              <p className="text-sm text-muted-foreground">
                Selecciona una tarjeta para ver sus gastos
              </p>
            </div>
          </div>
          <TarjetaFormModal onSuccess={cargarTarjetas} />
        </div>

        {loading ? (
          <Skeleton className="h-36 w-full max-w-[320px] rounded-xl" />
        ) : tarjetas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            <CreditCard className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <p>No tienes tarjetas cargadas.</p>
            <p className="text-sm mt-1">
              Agrega una tarjeta para comenzar a registrar gastos.
            </p>
          </div>
        ) : (
          <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2">
            {tarjetas.map((tarjeta) => (
              <div key={tarjeta.id} className="shrink-0">
                <TarjetaCard
                  tarjeta={tarjeta}
                  selected={selectedTarjetaId === tarjeta.id}
                  onClick={() => setSelectedTarjetaId(tarjeta.id)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedTarjetaId && tarjetas.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Gastos de{" "}
            {tarjetas.find((t) => t.id === selectedTarjetaId)?.nombre ??
              "tarjeta seleccionada"}
          </h2>
          <GastoTable
            tarjetaIdFilter={selectedTarjetaId}
            hideTarjetaFilter
          />
        </section>
      )}
    </div>
  );
}
