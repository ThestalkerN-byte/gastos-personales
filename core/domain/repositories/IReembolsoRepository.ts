import { Reembolso } from "../entities/Reembolso";
import { ReembolsoInput } from "../schemas/reembolso.schema";
import { ResumenFiltersInput } from "../schemas/resumen-filters.schema";

export interface IReembolsoRepository {
  save(reembolso: ReembolsoInput): Promise<void>;
  delete(reembolso: Reembolso): Promise<void>;
  findByGastoId(gastoId: string): Promise<Reembolso[]>;
  findByUserId(userId: string): Promise<Reembolso[]>;
  findByFilters(filters: ResumenFiltersInput): Promise<Reembolso[]>;
}
