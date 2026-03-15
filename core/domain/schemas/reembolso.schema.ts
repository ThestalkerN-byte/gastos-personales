import { z } from "zod";

export const ReembolsoSchema = z.object({
  gasto_id: z.string().uuid(),
  usuario_id: z.string().uuid(),
  monto: z
    .coerce.number()
    .positive("El monto debe ser un número positivo")
    .max(999999999, { message: "El monto es demasiado grande" }),
  de_quien: z.string().max(100).optional(),
  descripcion: z.string().max(500).optional(),
});

export type ReembolsoInput = z.infer<typeof ReembolsoSchema>;
