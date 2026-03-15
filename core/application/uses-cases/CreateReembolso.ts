import { IReembolsoRepository } from "@/core/domain/repositories/IReembolsoRepository";
import {
  ReembolsoInput,
  ReembolsoSchema,
} from "@/core/domain/schemas/reembolso.schema";

export class CreateReembolso {
  constructor(private reembolsoRepository: IReembolsoRepository) {}

  async execute(input: unknown) {
    const validation = ReembolsoSchema.safeParse(input);
    if (!validation.success) {
      throw new Error(
        validation.error.message + " Error en validación de reembolso"
      );
    }
    await this.reembolsoRepository.save(validation.data as ReembolsoInput);
  }
}
