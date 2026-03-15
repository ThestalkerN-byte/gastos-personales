---
name: use-case
description: Crear casos de uso en el proyecto gastos-personales siguiendo Clean Architecture. Usar cuando el usuario pida agregar, crear o implementar un caso de uso, use case, o lógica de aplicación.
---

# Caso de Uso en gastos-personales

Antes de implementar, lee [CONTEXTO_PROYECTO.md](../../CONTEXTO_PROYECTO.md) para entender la estructura.

## Ubicación

`core/application/uses-cases/<NombreCasoDeUso>.ts`

Nota: la carpeta actual se llama `uses-cases` (typo); mantener consistencia con el proyecto.

## Estructura base

```typescript
import { IXxxRepository } from "@/core/domain/repositories/IXxxRepository";
import { XxxInput, XxxSchema } from "@/core/domain/schemas/xxx.schema";

export class CreateXxx {
  constructor(private xxxRepository: IXxxRepository) {}

  async execute(input: unknown) {
    const validation = XxxSchema.safeParse(input);
    if (!validation.success) {
      throw new Error(validation.error.message + " Error en validación");
    }
    return await this.xxxRepository.create(validation.data);
  }
}
```

## Variaciones por tipo

### Crear entidad (Create)

- Recibe `input: unknown`.
- Valida con `XxxSchema.safeParse(input)`.
- Si falla: `throw new Error(...)`.
- Si ok: delegar a `repository.create(validation.data)`.

### Lectura por ID o filtro (Get)

```typescript
export class GetXxx {
  constructor(private xxxRepository: IXxxRepository) {}

  async execute(userId: string) {
    return await this.xxxRepository.findByUserId(userId);
  }
}
```

Sin validación compleja si el parámetro es simple.

### Lectura sin parámetros

```typescript
export class GetCategorias {
  constructor(private categoriaRepository: ICategoriaRepository) {}

  async execute() {
    return await this.categoriaRepository.findAll();
  }
}
```

### Casos con lógica adicional (ej. LoginUser)

- Validar con Zod.
- Llamar al repositorio.
- Comparar contraseñas, generar tokens, etc.
- Retornar lo necesario para la capa superior (usuario, token, etc.).

## Reglas

1. **Repositorio por constructor:** el caso de uso recibe la interfaz, no la implementación.
2. **Validación:** usar el schema de `core/domain/schemas/` para input.
3. **Sin infraestructura directa:** no importar Supabase ni DBClient; solo interfaces de dominio.
4. **Nomenclatura:** Verbo + Sustantivo — `CreateGasto`, `GetTarjetas`, `LoginUser`, `DeleteCategoria`.

## Schemas previos

El schema debe existir en `core/domain/schemas/<entidad>.schema.ts`. El caso de uso es el **único** responsable de la validación.

Cuando los datos vienen de `FormData` (string), usar `z.coerce` para campos numéricos:

```typescript
export const XxxSchema = z.object({
  campo1: z.string(),
  monto: z.coerce.number().positive(),
  cantidad_cuotas: z.coerce.number().optional(),
  usuario_id: z.string(),
});
export type XxxInput = z.infer<typeof XxxSchema>;
```

Si no existe, crearlo antes del caso de uso.

## Interfaz del repositorio

La interfaz debe estar en `core/domain/repositories/IXxxRepository.ts` y exponer el método que el caso de uso necesita (ej. `create`, `findByUserId`, `findAll`).

## Checklist

- [ ] Archivo en `core/application/uses-cases/<NombreCasoDeUso>.ts`
- [ ] Constructor con `IXxxRepository`
- [ ] Método `execute` con validación Zod cuando reciba datos de entrada
- [ ] Sin importar infraestructura
- [ ] Nomenclatura Verbo + Sustantivo
