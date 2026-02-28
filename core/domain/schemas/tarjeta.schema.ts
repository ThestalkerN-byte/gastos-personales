import { z } from "zod";
export const TarjetaSchema = z.object({
  nombre: z.string().max(255),
});
//Este es el tipo que se usará para la entrada de datos, es decir, lo que el usuario va a enviar para crear una tarjeta. No incluye el id ni usuarioId porque esos se generan automáticamente.
export type TarjetaInput = z.infer<typeof TarjetaSchema>;
