import { Gasto } from "../entities/Gasto";

export interface IGastoRepository {
  save(gasto: Gasto): Promise<void>;
  delete(gasto: Gasto): Promise<void>;
  findByUserId(userId: string): Promise<Gasto[]>;
}
