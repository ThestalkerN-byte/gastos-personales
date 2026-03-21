import { IMetaAhorroRepository } from "@/core/domain/repositories/IMetaAhorroRepository";
import {
  ContribucionAhorroInput,
  ContribucionAhorroSchema,
} from "@/core/domain/schemas/meta-ahorro.schema";

export class AddContribucionMetaAhorro {
  constructor(private metaAhorroRepository: IMetaAhorroRepository) {}

  async execute(input: unknown): Promise<void> {
    const validation = ContribucionAhorroSchema.safeParse(input);
    if (!validation.success) {
      throw new Error(
        validation.error.message + " Error en validación de contribución"
      );
    }

    const { meta_ahorro_id, usuario_id, monto, descripcion } = validation.data;
    await this.metaAhorroRepository.addContribucion(
      meta_ahorro_id,
      usuario_id,
      monto,
      descripcion
    );
  }
}
