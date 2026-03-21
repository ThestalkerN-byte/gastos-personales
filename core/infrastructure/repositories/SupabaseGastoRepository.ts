import { supabase } from "../db/DBClient";
import { IGastoRepository } from "../../domain/repositories/IGastoRepository";
import { Gasto } from "../../domain/entities/Gasto";
import { GastoInput } from "@/core/domain/schemas/gasto.schema";
import { GastoFiltersInput } from "@/core/domain/schemas/gasto-filters.schema";

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

    if (error) throw new Error(error.message + "Error en gasto");
  }
  async delete(gasto: Gasto): Promise<boolean | void> {
    const { error } = await supabase.from("gastos").delete().eq("id", gasto.id);

    if (error) {
      throw new Error(error.message);
    }
    return true;
  }
  async findByUserId(userId: string): Promise<Gasto[]> {
    const { data, error } = await supabase
      .from("gastos")
      .select("*")
      .eq("usuario_id", userId);

    if (error) throw new Error(error.message);
    return data;
  }

  async findByFilters(filters: GastoFiltersInput): Promise<Gasto[]> {
    const startDate = `${filters.anio}-${String(filters.mes).padStart(2, "0")}-01`;
    const endDate = new Date(filters.anio, filters.mes, 0);
    const endDateStr = endDate.toISOString().split("T")[0];

    let query = supabase
      .from("gastos")
      .select("*")
      .eq("usuario_id", filters.usuario_id)
      .gte("created_at", `${startDate}T00:00:00.000Z`)
      .lte("created_at", `${endDateStr}T23:59:59.999Z`);

    if (filters.tarjeta_id) {
      query = query.eq("tarjeta_id", filters.tarjeta_id);
    }

    if (filters.categoria_id) {
      query = query.eq("categoria_id", filters.categoria_id);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row: Record<string, unknown>) => {
      const created = row.created_at ?? row.createdAt;
      return {
        ...row,
        createdAt: created ? new Date(created as string) : new Date(),
      } as Gasto;
    });
  }

  async find(gasto: Gasto): Promise<Gasto> {
    const { data, error } = await supabase
      .from("gastos")
      .select("*")
      .eq("id", gasto.id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}
