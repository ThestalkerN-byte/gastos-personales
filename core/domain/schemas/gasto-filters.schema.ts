import { z } from "zod";

export const GastoFiltersSchema = z.object({
  usuario_id: z.string().uuid(),
  mes: z.coerce.number().min(1).max(12),
  anio: z.coerce.number().min(2000).max(2100),
  tarjeta_id: z
    .union([z.string().uuid(), z.literal(""), z.literal("all")])
    .optional()
    .transform((v) => (v === "" || v === "all" || !v ? undefined : v)),
  categoria_id: z
    .union([z.string().uuid(), z.literal(""), z.literal("all")])
    .optional()
    .transform((v) => (v === "" || v === "all" || !v ? undefined : v)),
});

export type GastoFiltersInput = z.infer<typeof GastoFiltersSchema>;
