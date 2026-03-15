"use server";

import { GetResumenMensual } from "@/core/application/uses-cases/GetResumenMensual";
import { SupabaseGastoRepository } from "@/core/infrastructure/repositories/SupabaseGastoRepository";
import { SupabaseIngresoRepository } from "@/core/infrastructure/repositories/SupabaseIngresoRepository";
import { ResumenMensual } from "@/core/domain/schemas/resumen-filters.schema";

export async function getResumenMensual(filters: {
  usuario_id: string;
  mes: number;
  anio: number;
}): Promise<ResumenMensual> {
  const ingresoRepository = new SupabaseIngresoRepository();
  const gastoRepository = new SupabaseGastoRepository();
  const useCase = new GetResumenMensual(ingresoRepository, gastoRepository);

  try {
    return await useCase.execute(filters);
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}
