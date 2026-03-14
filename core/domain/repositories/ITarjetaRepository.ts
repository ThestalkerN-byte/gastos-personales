import { Tarjeta } from "../entities/Tarjeta";
import { TarjetaInput } from "../schemas/tarjeta.schema";
export interface ITarjetaRepository {
    create(tarjeta: TarjetaInput): Promise<void>;
    delete(tarjeta: Tarjeta): Promise<void>;
    findByUserId(userId: string): Promise<Tarjeta[]>;
}