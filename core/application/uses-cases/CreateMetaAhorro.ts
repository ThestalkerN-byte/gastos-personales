import { IMetaAhorroRepository } from "@/core/domain/repositories/IMetaAhorroRepository";
import {
  MetaAhorroInput,
  MetaAhorroSchema,
} from "@/core/domain/schemas/meta-ahorro.schema";

export class CreateMetaAhorro {
  constructor(private metaAhorroRepository: IMetaAhorroRepository) {}

  async execute(input: unknown): Promise<void> {
    const validation = MetaAhorroSchema.safeParse(input);
    if (!validation.success) {
      throw new Error(
        validation.error.message + " Error en validación de meta de ahorro"
      );
    }
    await this.metaAhorroRepository.save(validation.data);
  }
}
