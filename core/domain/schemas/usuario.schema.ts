import { z } from "zod";
export const UsuarioInputSchema = z.object({
  usuario: z.string().max(255),
  password: z.string().max(255),
});
//Este es el tipo que se usará para la entrada de datos, es decir, lo que el usuario va a enviar para crear un usuario. No incluye el id porque ese se genera automáticamente.
export type UsuarioInput = z.infer<typeof UsuarioInputSchema>;
