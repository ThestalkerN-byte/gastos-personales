import { IIngresoRepository } from "@/core/domain/repositories/IIngresoRepository";
import {
  IngresoFiltersInput,
  IngresoFiltersSchema,
} from "@/core/domain/schemas/ingreso-filters.schema";

export class GetIngresosByFilters {
  constructor(private ingresoRepository: IIngresoRepository) {}

  async execute(input: unknown) {
    const validation = IngresoFiltersSchema.safeParse(input);
    if (!validation.success) {
      throw new Error(
        validation.error.message + " Error en validación de filtros"
      );
    }
    return await this.ingresoRepository.findByFilters(validation.data);
  }
}
