import { IGastoRepository } from "@/core/domain/repositories/IGastoRepository";
import { IIngresoRepository } from "@/core/domain/repositories/IIngresoRepository";
import {
  ResumenFiltersInput,
  ResumenFiltersSchema,
  ResumenMensual,
} from "@/core/domain/schemas/resumen-filters.schema";

export class GetResumenMensual {
  constructor(
    private ingresoRepository: IIngresoRepository,
    private gastoRepository: IGastoRepository
  ) {}

  async execute(input: unknown): Promise<ResumenMensual> {
    const validation = ResumenFiltersSchema.safeParse(input);
    if (!validation.success) {
      throw new Error(
        validation.error.message + " Error en validación de filtros"
      );
    }

    const filters: ResumenFiltersInput = validation.data;

    const [ingresos, gastos] = await Promise.all([
      this.ingresoRepository.findByFilters(filters),
      this.gastoRepository.findByFilters(filters),
    ]);

    const totalIngresos = ingresos.reduce((acc, i) => acc + (i.monto ?? 0), 0);
    const totalGastos = gastos.reduce((acc, g) => acc + (g.monto ?? 0), 0);
    const balance = totalIngresos - totalGastos;

    return {
      totalIngresos,
      totalGastos,
      balance,
    };
  }
}
