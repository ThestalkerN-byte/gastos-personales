import { supabase } from "../db/DBClient";
import { IReembolsoRepository } from "../../domain/repositories/IReembolsoRepository";
import { Reembolso } from "../../domain/entities/Reembolso";
import { ReembolsoInput } from "@/core/domain/schemas/reembolso.schema";
import { ResumenFiltersInput } from "@/core/domain/schemas/resumen-filters.schema";

export class SupabaseReembolsoRepository implements IReembolsoRepository {
  async save(reembolso: ReembolsoInput): Promise<void> {
    const { error } = await supabase.from("reembolsos").insert({
      gasto_id: reembolso.gasto_id,
      usuario_id: reembolso.usuario_id,
      monto: reembolso.monto,
      de_quien: reembolso.de_quien ?? null,
      descripcion: reembolso.descripcion ?? null,
    });

    if (error) throw new Error(error.message + " Error en reembolso");
  }

  async delete(reembolso: Reembolso): Promise<void> {
    const { error } = await supabase
      .from("reembolsos")
      .delete()
      .eq("id", reembolso.id);

    if (error) throw new Error(error.message);
  }

  async findByGastoId(gastoId: string): Promise<Reembolso[]> {
    const { data, error } = await supabase
      .from("reembolsos")
      .select("*")
      .eq("gasto_id", gastoId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return this.mapRows(data ?? []);
  }

  async findByUserId(userId: string): Promise<Reembolso[]> {
    const { data, error } = await supabase
      .from("reembolsos")
      .select("*")
      .eq("usuario_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return this.mapRows(data ?? []);
  }

  async findByFilters(filters: ResumenFiltersInput): Promise<Reembolso[]> {
    const startDate = `${filters.anio}-${String(filters.mes).padStart(2, "0")}-01`;
    const endDate = new Date(filters.anio, filters.mes, 0);
    const endDateStr = endDate.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("reembolsos")
      .select("*")
      .eq("usuario_id", filters.usuario_id)
      .gte("created_at", `${startDate}T00:00:00.000Z`)
      .lte("created_at", `${endDateStr}T23:59:59.999Z`)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return this.mapRows(data ?? []);
  }

  private mapRows(data: Record<string, unknown>[]): Reembolso[] {
    return data.map((row) => {
      const created = row.created_at ?? row.createdAt;
      return {
        ...row,
        createdAt: created ? new Date(created as string) : new Date(),
      } as Reembolso;
    });
  }
}
