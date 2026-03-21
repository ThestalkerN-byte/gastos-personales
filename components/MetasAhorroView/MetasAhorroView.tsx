"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { getMetasAhorro } from "@/app/_actions/meta-ahorro/actions";
import { MetaAhorro } from "@/core/domain/entities/MetaAhorro";
import { MetaAhorroCard } from "@/components/MetaAhorroCard/MetaAhorroCard";
import { MetaAhorroFormModal } from "@/components/MetaAhorroForm/MetaAhorroFormModal";
import { PiggyBank } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function MetasAhorroView() {
  const { user } = useUser();
  const [metas, setMetas] = useState<MetaAhorro[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarMetas = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await getMetasAhorro(user.id);
      setMetas(data);
    } catch (error) {
      console.error("Error cargando metas:", error);
      setMetas([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    cargarMetas();
  }, [cargarMetas]);

  if (!user?.id) {
    return <p className="text-sm text-destructive">Cargando usuario...</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <section
        id="metas-ahorro"
        className="rounded-lg border border-border bg-card p-6 shadow-sm"
        aria-labelledby="metas-heading"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <PiggyBank className="h-5 w-5" />
            </div>
            <div>
              <h1
                id="metas-heading"
                className="text-xl font-semibold text-card-foreground"
              >
                Mis metas de ahorro
              </h1>
              <p className="text-sm text-muted-foreground">
                Define metas y haz seguimiento de tu progreso
              </p>
            </div>
          </div>
          <MetaAhorroFormModal onSuccess={cargarMetas} />
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        ) : metas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            <PiggyBank className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <p>No tienes metas de ahorro creadas.</p>
            <p className="text-sm mt-1">
              Crea una meta para comenzar a ahorrar con un objetivo claro.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metas.map((meta) => (
              <MetaAhorroCard
                key={meta.id}
                meta={meta}
                onDataChanged={cargarMetas}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
