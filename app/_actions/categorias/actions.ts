"use server";
import { GetCategorias } from "@/core/application/uses-cases/GetCategorias";
import { Categoria } from "@/core/domain/entities/Categorias";
import { SupabaseCategoriaRepository } from "@/core/infrastructure/repositories/SupabaseCategoriaRepository";

export async function getCategorias(): Promise<Categoria[]> {
  const repository = new SupabaseCategoriaRepository();
  const useCase = new GetCategorias(repository);
  try {
    const categorias = await useCase.execute();
    return categorias;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}
