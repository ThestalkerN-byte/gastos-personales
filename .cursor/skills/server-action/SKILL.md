---
name: server-action
description: Dar de alta Server Actions en el proyecto gastos-personales siguiendo Clean Architecture. Usar cuando el usuario pida agregar, crear o implementar una Server Action, o acciones del servidor.
---

# Server Action en gastos-personales

Antes de implementar, lee [CONTEXTO_PROYECTO.md](../../CONTEXTO_PROYECTO.md) para entender la estructura.

## Ubicación

- Carpeta: `app/_actions/<entidad>/actions.ts`
- Si el dominio no existe, crear la carpeta (ej. `app/_actions/gasto/`, `app/_actions/tarjetas/`).

## Directiva obligatoria

```typescript
"use server";
```

Al inicio del archivo. Usar comillas dobles. Evitar typos como `'use server";'`.

## Patrón para mutaciones (crear, actualizar, eliminar)

La **Server Action no valida con Zod**. La validación es responsabilidad del caso de uso.

```typescript
import { CreateXxx } from "@/core/application/uses-cases/CreateXxx";
import { SupabaseXxxRepository } from "@/core/infrastructure/repositories/SupabaseXxxRepository";
import { ActionState } from "@/lib/interfaces";

export async function createXxxAction(formData: FormData): Promise<ActionState> {
  const data = Object.fromEntries(formData.entries());

  const repository = new SupabaseXxxRepository();
  const useCase = new CreateXxx(repository);
  try {
    await useCase.execute(data);
    return { success: true, message: "Creado correctamente" };
  } catch (error: unknown) {
    return { success: false, message: (error as Error).message };
  }
}
```

**Reglas:**

- **No validar con Zod** en la Server Action. El caso de uso es el encargado.
- Retornar siempre `ActionState` (`{ success: boolean; message: string } | null`).
- No hacer `throw new Error` hacia el cliente; capturar y devolver `{ success: false, message }`.

## Patrón para lecturas

```typescript
export async function getXxx(usuario_id?: string): Promise<Xxx[]> {
  const repository = new SupabaseXxxRepository();
  const useCase = new GetXxx(repository);
  try {
    return await useCase.execute(usuario_id ?? "");
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}
```

Retornar el tipo concreto. Para lecturas sin parámetros, el use case puede no recibir argumentos.

## Con useActionState

Si el formulario usa `useActionState`:

```typescript
export async function registerAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const data = Object.fromEntries(formData.entries());
  const repository = new SupabaseUsuarioRepository();
  const useCase = new CreateUser(repository);
  try {
    await useCase.execute(data);
    return { success: true, message: "Usuario creado" };
  } catch (error: unknown) {
    return { success: false, message: (error as Error).message };
  }
}
```

## Nomenclatura

| Tipo       | Convención   | Ejemplo                |
|-----------|--------------|------------------------|
| Mutación  | `xxxAction`  | `createGastoAction`    |
| Lectura   | `getXxx`     | `getTarjetas`          |

## Checklist

- [ ] `"use server"` al inicio
- [ ] Importar repositorio y caso de uso (no schema; el use case valida)
- [ ] Mutaciones: retorno `ActionState`, try/catch, no lanzar al cliente
- [ ] No validar con Zod; pasar datos raw al use case
- [ ] Ubicación correcta: `app/_actions/<entidad>/actions.ts`
