import { IIngresoRepository } from "@/core/domain/repositories/IIngresoRepository";
import {
  IngresoSchema,
  IngresoInput,
} from "@/core/domain/schemas/ingreso.schema";

export class CreateIngreso {
  constructor(private ingresoRepository: IIngresoRepository) {}

  async execute(input: unknown) {
    const validation = IngresoSchema.safeParse(input);
    if (!validation.success) {
      throw new Error(
        validation.error.message + " Error en validación de ingreso"
      );
    }
    await this.ingresoRepository.save(validation.data as IngresoInput);
  }
}
