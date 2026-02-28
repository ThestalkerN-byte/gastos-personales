import { z } from "zod";

export const GastoSchema = z.object({
  motivo: z.string().max(255),
  monto: z
    .number()
    .positive("El monto debe ser un número positivo")
    .max(999999999, { message: "El monto es demasiado grande" }),
  cantidad_cuotas: z.number(),
  categoriaId: z.string(),
  usuarioId: z.string(),
  tarjetaId: z.string(),
});
//Este es el tipo que se usará para la entrada de datos, es decir, lo que el usuario va a enviar para crear un gasto. No incluye el id ni createdAt porque esos se generan automáticamente.
export type GastoInput = z.infer<typeof GastoSchema>;
