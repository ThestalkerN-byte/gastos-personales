import { MetaAhorro } from "@/core/domain/entities/MetaAhorro";
import { IMetaAhorroRepository } from "@/core/domain/repositories/IMetaAhorroRepository";

export class DeleteMetaAhorro {
  constructor(private metaAhorroRepository: IMetaAhorroRepository) {}

  async execute(meta: MetaAhorro): Promise<void> {
    await this.metaAhorroRepository.delete(meta);
  }
}
