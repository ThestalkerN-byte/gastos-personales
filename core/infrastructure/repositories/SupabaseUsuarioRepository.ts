import { Usuario } from "@/core/domain/entities/Usuario";
import { IUsuarioRepository } from "@/core/domain/repositories/IUsuarioRepository";
import { UsuarioInput } from "@/core/domain/schemas/usuario.schema";
import { supabase } from "../db/DBClient";

export class SupabaseUsuarioRepository implements IUsuarioRepository {
  async create(usuario: UsuarioInput): Promise<Usuario> {
    const { data: newUser, error } = await supabase
      .from("usuarios")
      .insert({
        usuario: usuario.usuario,
        password: usuario.password, // Nota: En producción, hashear antes de guardar
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToDomain(newUser);
  }
  async findById(id: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // No encontrado
      throw new Error(error.message);
    }
    return this.mapToDomain(data);
  }
  async delete(usuario: Usuario): Promise<void> {}
  async updateData(usuario: Usuario): Promise<void> {}
  
  // Mapper para pasar de snake_case (DB) a camelCase (Domain)
  private mapToDomain(raw: Usuario): Usuario {
    return {
      id: raw.id,
      usuario: raw.usuario,
      password: raw.password,
    };
  }
}
