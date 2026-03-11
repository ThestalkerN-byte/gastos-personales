import { IUsuarioRepository } from "@/core/domain/repositories/IUsuarioRepository";
import { UsuarioInputSchema } from "@/core/domain/schemas/usuario.schema";
export class LoginUser {
  constructor(private usuarioRepository: IUsuarioRepository) {}
  async execute(input: unknown) {
    const validation = await UsuarioInputSchema.safeParse(input);
    if (!validation.success) {
      throw new Error(
        validation.error.message + "Error en la validacion de ZOD",
      );
    }
    const user = await this.usuarioRepository.findById(validation.data.usuario);
    if(!user) {
        throw new Error("Usuario no encontrado");
    }
    return await this.usuarioRepository.login(validation.data.usuario, validation.data.password);
  }
}
