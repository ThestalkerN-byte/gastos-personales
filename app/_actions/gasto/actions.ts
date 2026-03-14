'use server";'
import { CreateGasto } from "@/core/application/uses-cases/CreateGasto";
import { SupabaseGastoRepository } from "@/core/infrastructure/repositories/SupabaseGastoRepository";
import { GastoSchema } from "@/core/domain/schemas/gasto.schema";
import { ActionState } from "@/lib/interfaces";

export async function createGastoAction(
  formData: FormData,
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  console.log("Datos recibidos para crear gasto:", rawData);

  // Convertir tipos de string a los esperados por Zod
  const data = {
    ...rawData,
    monto: parseFloat(rawData.monto as string),
    cantidad_cuotas: rawData.cantidad_cuotas ? parseInt(rawData.cantidad_cuotas as string) : undefined,
  };

  // Validar con Zod
  const validation = GastoSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: validation.error.message };
  }

  const repository = new SupabaseGastoRepository();
  const useCase = new CreateGasto(repository);
  try {
    await useCase.execute(validation.data);
    return { success: true, message: "Gasto creado correctamente" };
  } catch (error: unknown) {
    return { success: false, message: (error as Error).message };
  }
}
