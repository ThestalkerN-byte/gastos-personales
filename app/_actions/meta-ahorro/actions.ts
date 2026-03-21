"use server";

import { CreateMetaAhorro } from "@/core/application/uses-cases/CreateMetaAhorro";
import { GetMetasAhorroByUserId } from "@/core/application/uses-cases/GetMetasAhorroByUserId";
import { AddContribucionMetaAhorro } from "@/core/application/uses-cases/AddContribucionMetaAhorro";
import { DeleteMetaAhorro } from "@/core/application/uses-cases/DeleteMetaAhorro";
import { MetaAhorro } from "@/core/domain/entities/MetaAhorro";
import { SupabaseMetaAhorroRepository } from "@/core/infrastructure/repositories/SupabaseMetaAhorroRepository";
import { ActionState } from "@/lib/interfaces";

export async function createMetaAhorroAction(
  formData: FormData
): Promise<ActionState> {
  const data = Object.fromEntries(formData.entries());
  const repository = new SupabaseMetaAhorroRepository();
  const useCase = new CreateMetaAhorro(repository);
  try {
    await useCase.execute(data);
    return { success: true, message: "Meta de ahorro creada correctamente" };
  } catch (error: unknown) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getMetasAhorro(usuarioId: string): Promise<MetaAhorro[]> {
  const repository = new SupabaseMetaAhorroRepository();
  const useCase = new GetMetasAhorroByUserId(repository);
  try {
    return await useCase.execute(usuarioId);
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}

export async function addContribucionMetaAhorroAction(
  formData: FormData
): Promise<ActionState> {
  const data = Object.fromEntries(formData.entries());
  const repository = new SupabaseMetaAhorroRepository();
  const useCase = new AddContribucionMetaAhorro(repository);
  try {
    await useCase.execute(data);
    return { success: true, message: "Contribución registrada correctamente" };
  } catch (error: unknown) {
    return { success: false, message: (error as Error).message };
  }
}

export async function deleteMetaAhorroAction(
  meta: MetaAhorro
): Promise<ActionState> {
  const repository = new SupabaseMetaAhorroRepository();
  const useCase = new DeleteMetaAhorro(repository);
  try {
    await useCase.execute(meta);
    return { success: true, message: "Meta de ahorro eliminada" };
  } catch (error: unknown) {
    return { success: false, message: (error as Error).message };
  }
}
