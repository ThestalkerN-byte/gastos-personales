import { IGastoRepository } from "@/core/domain/repositories/IGastoRepository";
import { GastoInput, GastoSchema } from "@/core/domain/schemas/gasto.schema";

export class CreateGasto {
    constructor(private gastoRepository: IGastoRepository) {}
    async execute(gastoData:unknown){
        // primer paso validar el schema con zod
        const validation  = GastoSchema.safeParse(gastoData);
        if(!validation.success){
            throw new Error(validation.error.message + 'Error en la validacion de ZOD');
        }
        //paso dos es asociar el gasto al usuario a traves del repositorio de gasto
        await this.gastoRepository.save(validation.data) 

    }

}