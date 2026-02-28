import { Usuario } from "../entities/Usuario";
import { UsuarioInput } from "../schemas/usuario.schema";

export interface IUsuarioRepository {
  create(usuario: UsuarioInput): Promise<Usuario | null>;
  delete(usuario: Usuario): Promise<void>;
  updateData(usuario: Usuario): Promise<void>;
  findById(id: string): Promise<Usuario | null>;
}
