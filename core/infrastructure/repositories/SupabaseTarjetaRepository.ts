import { Tarjeta } from "@/core/domain/entities/Tarjeta";
import { ITarjetaRepository } from "@/core/domain/repositories/ITarjetaRepository";
import { supabase } from "../db/DBClient";
import { TarjetaInput } from "@/core/domain/schemas/tarjeta.schema";

export class SupabaseTarjetaRepository implements ITarjetaRepository {
  async create(tarjeta: TarjetaInput): Promise<void> {
    const { error } = await supabase.from("tarjetas").insert({
      nombre: tarjeta.nombre,
      usuario_id: tarjeta.usuario_id,
    });
    if (error) throw new Error(error.message);
  }
  async delete(tarjeta: Tarjeta): Promise<void> {
    const { error } = await supabase
      .from("tarjetas")
      .delete()
      .eq("id", tarjeta.id);
    if (error) throw new Error(error.message);
  }
  async findByUserId(userId: string): Promise<Tarjeta[]> {
    const { data, error } = await supabase
      .from("tarjetas")
      .select()
      .eq("usuario_id", userId);
    if (error) throw new Error(error.message);
    return data;
  }
}
