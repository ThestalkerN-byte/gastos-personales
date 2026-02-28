import { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository";
import {
  UsuarioInput,
  UsuarioInputSchema,
} from "../../domain/schemas/usuario.schema";

export class CreateUser {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(input: unknown) {
    // 1. Validación de DTO con Zod
    const validation = UsuarioInputSchema.safeParse(input);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    // 2. Lógica de negocio (ej. verificar si el usuario ya existe)
    const existingUser = await this.usuarioRepository.findById(
      validation.data.usuario,
    );
    if (existingUser) {
      throw new Error("El nombre de usuario ya está en uso");
    }

    // 3. Persistencia a través del repositorio
    return await this.usuarioRepository.create(validation.data);
  }
}
