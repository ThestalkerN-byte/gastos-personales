import { supabase } from "../db/DBClient";
import { IGastoRepository } from "../../domain/repositories/IGastoRepository";
import { Gasto } from "../../domain/entities/Gasto";

export class SupabaseGastoRepository implements IGastoRepository {
  async save(gasto: Gasto): Promise<void> {
    const { error } = await supabase.from("gastos").insert({
      cantidad_cuotas: gasto.cantidad_cuotas,
      motivo: gasto.motivo,
      monto: gasto.monto,
      categoria_id: gasto.categoriaId,
      usuario_id: gasto.usuarioId,
    });

    if (error) throw new Error(error.message);
  }
  async delete(gasto: Gasto): Promise<void> {
    const { error } = await supabase.from("gastos").delete().eq("id", gasto.id);

    if (error) throw new Error(error.message);
  }
  async findByUserId(userId: string): Promise<Gasto[]> {
    const { data, error } = await supabase
      .from("gastos")
      .select("*")
      .eq("usuario_id", userId);

    if (error) throw new Error(error.message);
    return data;
  }
}
