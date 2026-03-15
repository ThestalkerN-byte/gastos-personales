---
name: clean-architecture
description: Modificar o extender la estructura del proyecto gastos-personales siguiendo Clean Architecture. Usar cuando el usuario pida agregar entidades, repositorios, modificar la arquitectura o cambiar la estructura de core/domain, core/application o core/infrastructure.
---

# Modificar estructura con Clean Architecture

Antes de modificar, lee [CONTEXTO_PROYECTO.md](../../CONTEXTO_PROYECTO.md) para entender la estructura actual.

## Regla de dependencias

```
Domain ← Application ← Infrastructure
```

- **Domain**: no depende de nadie. Contiene entidades, interfaces de repositorio, schemas.
- **Application**: depende solo de Domain. Contiene casos de uso.
- **Infrastructure**: implementa interfaces de Domain. Depende de Domain.

Nunca: Application → Infrastructure, ni Domain → Application/Infrastructure.

## Agregar una nueva entidad (flujo completo)

### 1. Entidad (`core/domain/entities/Xxx.ts`)

```typescript
export interface Xxx {
  readonly id: string;
  campo1: string;
  campo2: number;
  usuario_id: string;
  readonly createdAt?: Date;
}
```

### 2. Schema (`core/domain/schemas/xxx.schema.ts`)

```typescript
import { z } from "zod";

export const XxxSchema = z.object({
  campo1: z.string().max(255),
  campo2: z.number().positive(),
  usuario_id: z.string().uuid(),
  // opcionales: campo_opcional: z.string().optional(),
});
export type XxxInput = z.infer<typeof XxxSchema>;
```

### 3. Interfaz de repositorio (`core/domain/repositories/IXxxRepository.ts`)

```typescript
import { Xxx } from "../entities/Xxx";
import { XxxInput } from "../schemas/xxx.schema";

export interface IXxxRepository {
  create(xxx: XxxInput): Promise<void>;
  delete(xxx: Xxx): Promise<void>;
  findByUserId(userId: string): Promise<Xxx[]>;
  // otros métodos según necesidad
}
```

### 4. Implementación (`core/infrastructure/repositories/SupabaseXxxRepository.ts`)

```typescript
import { supabase } from "../db/DBClient";
import { IXxxRepository } from "../../domain/repositories/IXxxRepository";
import { Xxx } from "../../domain/entities/Xxx";
import { XxxInput } from "@/core/domain/schemas/xxx.schema";

export class SupabaseXxxRepository implements IXxxRepository {
  async create(xxx: XxxInput): Promise<void> {
    const { error } = await supabase.from("xxx").insert({
      campo1: xxx.campo1,
      campo2: xxx.campo2,
      usuario_id: xxx.usuario_id,
    });
    if (error) throw new Error(error.message);
  }
  // ...
}
```

Tabla Supabase: nombre plural según convención (`gastos`, `tarjetas`, `categorias`).

### 5. Caso de uso (`core/application/uses-cases/CreateXxx.ts`)

Ver skill [use-case](../use-case/SKILL.md).

### 6. Server Action (`app/_actions/<entidad>/actions.ts`)

Ver skill [server-action](../server-action/SKILL.md).

## Nomenclatura

| Elemento          | Convención              | Ejemplo                    |
|-------------------|-------------------------|----------------------------|
| Entidad           | PascalCase singular     | `Gasto`, `Tarjeta`         |
| Schema            | `XxxSchema`, `XxxInput`  | `GastoSchema`              |
| Interfaz repo     | `IXxxRepository`        | `IGastoRepository`         |
| Impl. repo        | `SupabaseXxxRepository` | `SupabaseGastoRepository`  |
| Caso de uso       | Verbo + Sustantivo      | `CreateGasto`, `GetTarjetas`|
| Tabla Supabase    | plural minúscula        | `gastos`, `tarjetas`       |

## Modificar entidad existente

1. Actualizar `entities/Xxx.ts`.
2. Actualizar `schemas/xxx.schema.ts` si cambian campos de input.
3. Revisar `IXxxRepository` — agregar/ajustar métodos.
4. Actualizar `SupabaseXxxRepository` para nuevos métodos y cambios de columnas.
5. Actualizar casos de uso que usen la entidad.
6. Actualizar Server Actions si cambia el flujo.

## Modificar solo repositorio (nuevo método)

1. Agregar método a `IXxxRepository`.
2. Implementar en `SupabaseXxxRepository`.
3. Crear o modificar caso de uso que lo use.
4. Exponer vía Server Action si es necesario.

## Estructura de carpetas a respetar

```
core/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── schemas/
├── application/
│   └── uses-cases/
├── infrastructure/
│   ├── db/
│   └── repositories/
└── utils/
```

No crear capas nuevas sin consenso. Mantener la separación clara.

## Checklist para cambios estructurales

- [ ] Domain no importa de Application ni Infrastructure
- [ ] Application solo importa de Domain
- [ ] Infrastructure implementa interfaces de Domain
- [ ] Nomenclatura consistente con el resto del proyecto
- [ ] Schemas Zod para validación de input
- [ ] Tablas Supabase en plural y minúsculas
