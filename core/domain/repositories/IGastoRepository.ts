import { Gasto } from "../entities/Gasto";
import { GastoInput } from "../schemas/gasto.schema";

export interface IGastoRepository {
  save(gasto: GastoInput): Promise<void>;
  delete(gasto: Gasto): Promise<void>;
  findByUserId(userId: string): Promise<Gasto[]>;
}
