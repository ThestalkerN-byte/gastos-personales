import { z } from "zod";

export const IngresoFiltersSchema = z.object({
  usuario_id: z.string().uuid(),
  mes: z.coerce.number().min(1).max(12),
  anio: z.coerce.number().min(2000).max(2100),
  categoria_id: z
    .union([z.string().uuid(), z.literal(""), z.literal("all")])
    .optional()
    .transform((v) => (v === "" || v === "all" || !v ? undefined : v)),
});

export type IngresoFiltersInput = z.infer<typeof IngresoFiltersSchema>;
