import { z } from "zod";

export const MetaAhorroSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(255),
  monto_objetivo: z.coerce
    .number()
    .positive("El monto objetivo debe ser positivo")
    .max(999999999),
  monto_actual: z.coerce.number().min(0).optional(),
  descripcion: z.string().max(500).optional(),
  usuario_id: z.string().uuid(),
});

export type MetaAhorroInput = z.infer<typeof MetaAhorroSchema>;

export const ContribucionAhorroSchema = z.object({
  meta_ahorro_id: z.string().uuid(),
  usuario_id: z.string().uuid(),
  monto: z.coerce.number().refine((v) => v !== 0, "El monto no puede ser cero"),
  descripcion: z.string().max(500).optional(),
});

export type ContribucionAhorroInput = z.infer<typeof ContribucionAhorroSchema>;
