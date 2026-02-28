import { Tarjeta } from "../entities/Tarjeta";
export interface ITarjetaRepository {
    create(tarjeta: Tarjeta): Promise<void>;
    delete(tarjeta: Tarjeta): Promise<void>;
    findByUserId(userId: string): Promise<Tarjeta[]>;
}