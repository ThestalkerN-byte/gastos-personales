import { Reembolso } from "../entities/Reembolso";
import { ReembolsoInput } from "../schemas/reembolso.schema";

export interface IReembolsoRepository {
  save(reembolso: ReembolsoInput): Promise<void>;
  delete(reembolso: Reembolso): Promise<void>;
  findByGastoId(gastoId: string): Promise<Reembolso[]>;
  findByUserId(userId: string): Promise<Reembolso[]>;
}
