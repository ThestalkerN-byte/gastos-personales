'use server'
import { CreateTarjeta } from "@/core/application/uses-cases/CreateTarjeta";
import { GetTarjetas } from "@/core/application/uses-cases/GetTarjetas";
import { Tarjeta } from "@/core/domain/entities/Tarjeta";
import { TarjetaSchema } from "@/core/domain/schemas/tarjeta.schema";
import { SupabaseTarjetaRepository } from "@/core/infrastructure/repositories/SupabaseTarjetaRepository";
import { ActionState } from "@/lib/interfaces";

export async function getTarjetas(usuario_id: string): Promise<Tarjeta[]> {
  const repository = new SupabaseTarjetaRepository();
  const useCase = new GetTarjetas(repository);
  try {
    const tarjetasPerUser = await useCase.execute(usuario_id);
    return tarjetasPerUser;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}
export async function createTarjetaAction(
  formData: FormData,
): Promise<ActionState> {
  const data = Object.fromEntries(formData.entries());
  try {
    const repository = new SupabaseTarjetaRepository();
    const useCase = new CreateTarjeta(repository);
    await useCase.execute(data);
    return { success: true, message: "Tarjeta creada exitosamente" };
  } catch (error) {
    throw new Error("Error al crear la tarjeta");
  }
}
