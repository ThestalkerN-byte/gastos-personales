import { IGastoRepository } from "@/core/domain/repositories/IGastoRepository";
import { IIngresoRepository } from "@/core/domain/repositories/IIngresoRepository";
import { IReembolsoRepository } from "@/core/domain/repositories/IReembolsoRepository";
import {
  ResumenFiltersInput,
  ResumenFiltersSchema,
  ResumenMensual,
} from "@/core/domain/schemas/resumen-filters.schema";

export class GetResumenMensual {
  constructor(
    private ingresoRepository: IIngresoRepository,
    private gastoRepository: IGastoRepository,
    private reembolsoRepository: IReembolsoRepository
  ) {}

  async execute(input: unknown): Promise<ResumenMensual> {
    const validation = ResumenFiltersSchema.safeParse(input);
    if (!validation.success) {
      throw new Error(
        validation.error.message + " Error en validación de filtros"
      );
    }

    const filters: ResumenFiltersInput = validation.data;

    const [ingresos, gastos, reembolsos] = await Promise.all([
      this.ingresoRepository.findByFilters(filters),
      this.gastoRepository.findByFilters(filters),
      this.reembolsoRepository.findByFilters(filters),
    ]);

    const totalIngresos = ingresos.reduce((acc, i) => acc + (i.monto ?? 0), 0);
    const totalGastos = gastos.reduce((acc, g) => acc + (g.monto ?? 0), 0);
    const totalReembolsos = reembolsos.reduce((acc, r) => acc + (r.monto ?? 0), 0);
    const balance = totalIngresos - totalGastos + totalReembolsos;

    return {
      totalIngresos,
      totalGastos,
      totalReembolsos,
      balance,
    };
  }
}
