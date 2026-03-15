import { IReembolsoRepository } from "@/core/domain/repositories/IReembolsoRepository";

export class GetReembolsosByGastoId {
  constructor(private reembolsoRepository: IReembolsoRepository) {}

  async execute(gastoId: string) {
    return await this.reembolsoRepository.findByGastoId(gastoId);
  }
}
