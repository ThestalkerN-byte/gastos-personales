import { Categoria } from "../entities/Categorias";
import { CategoriaInput } from "../schemas/categoria.schema";
export interface ICategoriaRepository {
  create(categoria: CategoriaInput): Promise<void>;
  delete(categoria: Categoria): Promise<void>;
  findAll(): Promise<Categoria[]>;
}
