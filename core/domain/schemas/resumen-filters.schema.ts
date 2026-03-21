import { z } from "zod";

export const ResumenFiltersSchema = z.object({
  usuario_id: z.string(),
  mes: z.coerce.number().min(1).max(12),
  anio: z.coerce.number().min(2000).max(2100),
});

export type ResumenFiltersInput = z.infer<typeof ResumenFiltersSchema>;

export interface ResumenMensual {
  totalIngresos: number;
  totalGastos: number;
  totalReembolsos: number;
  balance: number;
}
