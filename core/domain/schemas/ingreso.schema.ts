import { z } from "zod";

export const IngresoSchema = z.object({
  monto: z
    .coerce.number()
    .positive("El monto debe ser un número positivo")
    .max(999999999, { message: "El monto es demasiado grande" }),
  categoria_id: z.string(),
  descripcion: z.string().max(500).optional(),
  usuario_id: z.string(),
});

export type IngresoInput = z.infer<typeof IngresoSchema>;
