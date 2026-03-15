import { supabase } from "../db/DBClient";
import { IReembolsoRepository } from "../../domain/repositories/IReembolsoRepository";
import { Reembolso } from "../../domain/entities/Reembolso";
import { ReembolsoInput } from "@/core/domain/schemas/reembolso.schema";

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
