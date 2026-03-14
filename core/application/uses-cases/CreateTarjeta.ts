import { ITarjetaRepository } from "@/core/domain/repositories/ITarjetaRepository";
import { TarjetaInput, TarjetaSchema } from "@/core/domain/schemas/tarjeta.schema";

export class CreateTarjeta {
    constructor(private tarjetaRepository: ITarjetaRepository) {}
    async execute(tarjetaData: unknown) {
        // primer paso validar el schema con zod
        const validation = TarjetaSchema.safeParse(tarjetaData);
        if (!validation.success) {
            throw new Error("Datos de tarjeta inválidos");
        }
        // segundo paso crear la tarjeta en el repositorio
        return await this.tarjetaRepository.create(validation.data);
    }
}