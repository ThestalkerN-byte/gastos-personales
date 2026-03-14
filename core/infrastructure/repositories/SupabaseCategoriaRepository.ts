import { Categoria } from "@/core/domain/entities/Categorias";
import { ICategoriaRepository } from "@/core/domain/repositories/ICategoriaRepository";
import { CategoriaInput } from "@/core/domain/schemas/categoria.schema";
import { supabase } from "../db/DBClient";
export class SupabaseCategoriaRepository implements ICategoriaRepository {
  async create(categoria: CategoriaInput): Promise<void> {
    const { error } = await supabase.from("categorias").insert({
      nombre: categoria.nombre,
    });
    if (error) throw new Error(error.message);
  }
  async delete(categoria: Categoria): Promise<void> {
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("id", categoria.id);
    if (error) throw new Error(error.message);
  }
  async findAll(): Promise<Categoria[]> {
    const { data, error } = await supabase.from("categorias").select("*");
    if (error) throw new Error(error.message);
    return data;
  }
}
