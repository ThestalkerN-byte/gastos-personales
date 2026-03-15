import { IGastoRepository } from "@/core/domain/repositories/IGastoRepository";
import {
  GastoFiltersInput,
  GastoFiltersSchema,
} from "@/core/domain/schemas/gasto-filters.schema";

export class GetGastosByFilters {
  constructor(private gastoRepository: IGastoRepository) {}

  async execute(input: unknown) {
    const validation = GastoFiltersSchema.safeParse(input);
    if (!validation.success) {
      throw new Error(validation.error.message + " Error en validación de filtros");
    }
    return await this.gastoRepository.findByFilters(validation.data);
  }
}
