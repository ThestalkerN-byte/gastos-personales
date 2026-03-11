import { Usuario } from "@/core/domain/entities/Usuario";
import { IUsuarioRepository } from "@/core/domain/repositories/IUsuarioRepository";
import { UsuarioInput } from "@/core/domain/schemas/usuario.schema";
import { supabase } from "../db/DBClient";
import { hashPassword, verifyPassword } from "../../utils/hash";
export class SupabaseUsuarioRepository implements IUsuarioRepository {
  async create(usuario: UsuarioInput): Promise<Usuario> {
    const hashedPassword = await hashPassword(usuario.password);

    const { data: newUser, error } = await supabase
      .from("usuarios")
      .insert({
        usuario: usuario.usuario,
        password: hashedPassword,
      })
      .select()
      .single();

    if (error)
      throw new Error(error.message + "Error al crear el usuario en Supabase");
    return this.mapToDomain(newUser);
  }
  async findById(username: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("usuario", username)
      .single();

    if (error) {
      console.log("Error al buscar usuario por ID:", error);
      if (error.code === "PGRST116") return null; // No encontrado
      throw new Error(error.message);
    }
    return this.mapToDomain(data);
  }
  async login(usuario: string, password: string): Promise<Usuario  | null> {
    const user = await this.findById(usuario);
    if (!user) return null
    //Comparo las contraseñas para saber si coinciden
    const isValid = await verifyPassword(password, user.password);
    if(isValid) {
        return user
    }
    return null
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
