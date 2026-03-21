import { Ingreso } from "@/core/domain/entities/Ingreso";
import { IIngresoRepository } from "@/core/domain/repositories/IIngresoRepository";

export class DeleteIngreso {
    constructor(private ingresoRepository: IIngresoRepository) {}
    async execute(ingreso: Ingreso): Promise<boolean|void> {
        return await this.ingresoRepository.delete(ingreso);
    }
}