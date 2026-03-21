import { MetaAhorro } from "../entities/MetaAhorro";
import { MetaAhorroInput } from "../schemas/meta-ahorro.schema";

export interface IMetaAhorroRepository {
  save(meta: MetaAhorroInput): Promise<void>;
  delete(meta: MetaAhorro): Promise<void>;
  findByUserId(userId: string): Promise<MetaAhorro[]>;
  findById(id: string): Promise<MetaAhorro | null>;
  addContribucion(
    metaId: string,
    usuarioId: string,
    monto: number,
    descripcion?: string
  ): Promise<void>;
}
