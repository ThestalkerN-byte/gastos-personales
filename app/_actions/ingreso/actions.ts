"use server";

import { CreateIngreso } from "@/core/application/uses-cases/CreateIngreso";
import { GetIngresosByFilters } from "@/core/application/uses-cases/GetIngresosByFilters";
import { Ingreso } from "@/core/domain/entities/Ingreso";
import { SupabaseIngresoRepository } from "@/core/infrastructure/repositories/SupabaseIngresoRepository";
import { ActionState } from "@/lib/interfaces";

export async function createIngresoAction(
  formData: FormData
): Promise<ActionState> {
  const data = Object.fromEntries(formData.entries());

  const repository = new SupabaseIngresoRepository();
  const useCase = new CreateIngreso(repository);
  try {
    await useCase.execute(data);
    return { success: true, message: "Ingreso creado correctamente" };
  } catch (error: unknown) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getIngresosByFilters(filters: {
  usuario_id: string;
  mes: number;
  anio: number;
  categoria_id?: string;
}): Promise<Ingreso[]> {
  const repository = new SupabaseIngresoRepository();
  const useCase = new GetIngresosByFilters(repository);
  try {
    return await useCase.execute(filters);
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}
