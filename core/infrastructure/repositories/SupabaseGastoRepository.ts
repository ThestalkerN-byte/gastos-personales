import { supabase } from "../db/DBClient";
import { IGastoRepository } from "../../domain/repositories/IGastoRepository";
import { Gasto } from "../../domain/entities/Gasto";
import { GastoInput } from "@/core/domain/schemas/gasto.schema";

export class SupabaseGastoRepository implements IGastoRepository {
  async save(gasto: GastoInput): Promise<void> {
    const { error } = await supabase.from("gastos").insert({
      cantidad_cuotas: gasto?.cantidad_cuotas,
      motivo: gasto.motivo,
      monto: gasto.monto,
      categoria_id: gasto.categoria_id,
      usuario_id: gasto.usuario_id,
      tarjeta_id: gasto?.tarjeta_id,
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
