import { Gasto } from "@/core/domain/entities/Gasto";
import { IGastoRepository } from "@/core/domain/repositories/IGastoRepository";

export class DeleteGasto {
    constructor(private gastoRepository: IGastoRepository) {}
    async execute(gasto: Gasto): Promise<boolean | void> {
        return await this.gastoRepository.delete(gasto);
    }
}