import { ITarjetaRepository } from "@/core/domain/repositories/ITarjetaRepository";

export class GetTarjetas {
    constructor(private tarjetaRepository: ITarjetaRepository) {}
    async execute(userId: string) {
        return await this.tarjetaRepository.findByUserId(userId);
    }
}