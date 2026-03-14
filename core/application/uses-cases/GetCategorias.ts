import { ICategoriaRepository } from "@/core/domain/repositories/ICategoriaRepository";

export class GetCategorias {
    constructor(private categoriaRepository: ICategoriaRepository) {}
    async execute() {
        return await this.categoriaRepository.findAll();
    }
}