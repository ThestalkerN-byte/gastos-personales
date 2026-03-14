import { z } from "zod";
export const CategoriaSchema = z.object({
  nombre: z.string().max(255),
});
export type CategoriaInput = z.infer<typeof CategoriaSchema>;