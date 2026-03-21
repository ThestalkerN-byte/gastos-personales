import { MetaAhorro } from "@/core/domain/entities/MetaAhorro";
import { IMetaAhorroRepository } from "@/core/domain/repositories/IMetaAhorroRepository";

export class GetMetasAhorroByUserId {
  constructor(private metaAhorroRepository: IMetaAhorroRepository) {}

  async execute(userId: string): Promise<MetaAhorro[]> {
    if (!userId) return [];
    return await this.metaAhorroRepository.findByUserId(userId);
  }
}
