"use server";

import { SupabaseUsuarioRepository } from "@/core/infrastructure/repositories/SupabaseUsuarioRepository";
import { CreateUser } from "@/core/application/uses-cases/CreateUser";

export async function registerAction({ formData }: { formData: FormData }) {
    console.log("Datos recibidos en el servidor:", Object.fromEntries(formData.entries()));
  // 1. Inyección de dependencias
  const repository = new SupabaseUsuarioRepository();
  const useCase = new CreateUser(repository);

  // 2. Extracción de datos
  const data = Object.fromEntries(formData.entries());

  try {
    // 3. Ejecución del caso de uso (que ya valida con Zod e interactúa con Infra)
    await useCase.execute(data);

    // Si el flujo continúa aquí, es que fue exitoso
    return { success: true, message: "Usuario creado correctamente" };
  } catch (error: unknown) {
    // Retornamos el error para que la UI lo muestre
    return { success: false, message: (error as Error).message };
  }
}
