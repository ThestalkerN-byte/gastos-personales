import { Ingreso } from "../entities/Ingreso";
import { IngresoInput } from "../schemas/ingreso.schema";
import { IngresoFiltersInput } from "../schemas/ingreso-filters.schema";

export interface IIngresoRepository {
  save(ingreso: IngresoInput): Promise<void>;
  delete(ingreso: Ingreso): Promise<void>;
  findByUserId(userId: string): Promise<Ingreso[]>;
  findByFilters(filters: IngresoFiltersInput): Promise<Ingreso[]>;
}
