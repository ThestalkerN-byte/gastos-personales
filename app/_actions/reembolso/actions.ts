"use server";

import { CreateReembolso } from "@/core/application/uses-cases/CreateReembolso";
import { GetReembolsosByGastoId } from "@/core/application/uses-cases/GetReembolsosByGastoId";
import { Reembolso } from "@/core/domain/entities/Reembolso";
import { SupabaseReembolsoRepository } from "@/core/infrastructure/repositories/SupabaseReembolsoRepository";
import { ActionState } from "@/lib/interfaces";

export async function createReembolsoAction(
  formData: FormData
): Promise<ActionState> {
  const data = Object.fromEntries(formData.entries());

  const repository = new SupabaseReembolsoRepository();
  const useCase = new CreateReembolso(repository);
  try {
    await useCase.execute(data);
    return { success: true, message: "Reembolso registrado correctamente" };
  } catch (error: unknown) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getReembolsosByGastoId(
  gastoId: string
): Promise<Reembolso[]> {
  const repository = new SupabaseReembolsoRepository();
  const useCase = new GetReembolsosByGastoId(repository);
  try {
    return await useCase.execute(gastoId);
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}
