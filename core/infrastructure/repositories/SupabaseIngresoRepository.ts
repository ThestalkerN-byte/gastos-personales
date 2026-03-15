import { supabase } from "../db/DBClient";
import { IIngresoRepository } from "../../domain/repositories/IIngresoRepository";
import { Ingreso } from "../../domain/entities/Ingreso";
import { IngresoInput } from "@/core/domain/schemas/ingreso.schema";
import { IngresoFiltersInput } from "@/core/domain/schemas/ingreso-filters.schema";

export class SupabaseIngresoRepository implements IIngresoRepository {
  async save(ingreso: IngresoInput): Promise<void> {
    const { error } = await supabase.from("ingresos").insert({
      monto: ingreso.monto,
      categoria_id: ingreso.categoria_id,
      descripcion: ingreso.descripcion ?? null,
      usuario_id: ingreso.usuario_id,
    });

    if (error) throw new Error(error.message + " Error en ingreso");
  }

  async delete(ingreso: Ingreso): Promise<void> {
    const { error } = await supabase
      .from("ingresos")
      .delete()
      .eq("id", ingreso.id);

    if (error) throw new Error(error.message);
  }

  async findByUserId(userId: string): Promise<Ingreso[]> {
    const { data, error } = await supabase
      .from("ingresos")
      .select("*")
      .eq("usuario_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return this.mapRows(data ?? []);
  }

  async findByFilters(filters: IngresoFiltersInput): Promise<Ingreso[]> {
    const startDate = `${filters.anio}-${String(filters.mes).padStart(2, "0")}-01`;
    const endDate = new Date(filters.anio, filters.mes, 0);
    const endDateStr = endDate.toISOString().split("T")[0];

    let query = supabase
      .from("ingresos")
      .select("*")
      .eq("usuario_id", filters.usuario_id)
      .gte("created_at", `${startDate}T00:00:00.000Z`)
      .lte("created_at", `${endDateStr}T23:59:59.999Z`);

    if (filters.categoria_id) {
      query = query.eq("categoria_id", filters.categoria_id);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw new Error(error.message);
    return this.mapRows(data ?? []);
  }

  private mapRows(data: Record<string, unknown>[]): Ingreso[] {
    return data.map((row) => {
      const created = row.created_at ?? row.createdAt;
      return {
        ...row,
        createdAt: created ? new Date(created as string) : new Date(),
      } as Ingreso;
    });
  }
}
