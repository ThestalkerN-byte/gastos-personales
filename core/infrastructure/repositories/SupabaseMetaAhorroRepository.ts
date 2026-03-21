import { supabase } from "../db/DBClient";
import { IMetaAhorroRepository } from "../../domain/repositories/IMetaAhorroRepository";
import { MetaAhorro } from "../../domain/entities/MetaAhorro";
import { MetaAhorroInput } from "@/core/domain/schemas/meta-ahorro.schema";

export class SupabaseMetaAhorroRepository implements IMetaAhorroRepository {
  async save(meta: MetaAhorroInput): Promise<void> {
    const { error } = await supabase.from("metas_ahorro").insert({
      nombre: meta.nombre,
      monto_objetivo: meta.monto_objetivo,
      monto_actual: meta.monto_actual ?? 0,
      descripcion: meta.descripcion ?? null,
      usuario_id: meta.usuario_id,
    });

    if (error) throw new Error(error.message + " Error al crear meta de ahorro");
  }

  async delete(meta: MetaAhorro): Promise<void> {
    const { error } = await supabase
      .from("metas_ahorro")
      .delete()
      .eq("id", meta.id);

    if (error) throw new Error(error.message);
  }

  async findByUserId(userId: string): Promise<MetaAhorro[]> {
    const { data, error } = await supabase
      .from("metas_ahorro")
      .select("*")
      .eq("usuario_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(this.mapRow);
  }

  async findById(id: string): Promise<MetaAhorro | null> {
    const { data, error } = await supabase
      .from("metas_ahorro")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(error.message);
    }
    return data ? this.mapRow(data) : null;
  }

  async addContribucion(
    metaId: string,
    usuarioId: string,
    monto: number,
    descripcion?: string
  ): Promise<void> {
    const meta = await this.findById(metaId);
    if (!meta || meta.usuario_id !== usuarioId) {
      throw new Error("Meta de ahorro no encontrada");
    }

    const nuevoMontoActual = meta.monto_actual + monto;
    if (nuevoMontoActual < 0) {
      throw new Error("El retiro supera el saldo actual de la meta");
    }

    const { error: errorMovimiento } = await supabase
      .from("movimientos_ahorro")
      .insert({
        meta_ahorro_id: metaId,
        usuario_id: usuarioId,
        monto,
        descripcion: descripcion ?? null,
      });

    if (errorMovimiento)
      throw new Error(
        errorMovimiento.message + " Error al registrar contribución"
      );

    const { error: errorUpdate } = await supabase
      .from("metas_ahorro")
      .update({ monto_actual: nuevoMontoActual })
      .eq("id", metaId);

    if (errorUpdate) throw new Error(errorUpdate.message + " Error al actualizar meta");
  }

  private mapRow(row: Record<string, unknown>): MetaAhorro {
    const created = row.created_at ?? row.createdAt;
    return {
      ...row,
      monto_objetivo: Number(row.monto_objetivo ?? 0),
      monto_actual: Number(row.monto_actual ?? 0),
      descripcion: (row.descripcion as string) ?? null,
      createdAt: created ? new Date(created as string) : new Date(),
    } as MetaAhorro;
  }
}
