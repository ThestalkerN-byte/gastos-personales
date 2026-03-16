# Contexto del Proyecto: gastos-personales

Este documento sirve como referencia para entender la arquitectura, convenciones y patrones del proyecto. Usar como base para mantener consistencia al agregar Server Actions, casos de uso o modificar la estructura.

---

## 1. Estructura de Directorios

```
gastos-personales/
├── app/
│   ├── _actions/              # Server Actions por dominio
│   │   ├── categorias/actions.ts
│   │   ├── gasto/actions.ts
│   │   ├── ingreso/actions.ts
│   │   ├── reembolso/actions.ts
│   │   └── resumen/actions.ts
│   │   ├── tarjetas/actions.ts
│   │   └── user/actions.ts
│   ├── home/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # shadcn/ui
│   ├── AuthForm/
│   ├── GastosModule/
│   ├── GastoForm/
│   ├── GastoTable/
│   ├── HomeDashboard/
│   ├── IngresosModule/
│   ├── IngresoForm/
│   ├── IngresoTable/
│   ├── ReembolsoForm/
│   ├── ResumenCard/
│   ├── TarjetaForm/
│   ├── app-header.tsx
│   └── app-sidebar.tsx
├── context/
│   └── UserContext.tsx
├── core/                      # Clean Architecture
│   ├── application/
│   │   └── uses-cases/        # Casos de uso (nota: typo "uses" existente)
│   ├── domain/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── schemas/
│   ├── infrastructure/
│   │   ├── db/
│   │   └── repositories/
│   └── utils/
├── hooks/
├── lib/
│   ├── interfaces.ts
│   └── utils.ts
└── public/
```

---

## 2. Clean Architecture

### Capas y Responsabilidades

| Capa | Ubicación | Contenido |
|------|-----------|-----------|
| **Domain** | `core/domain/` | Entidades, interfaces de repositorios, schemas Zod |
| **Application** | `core/application/uses-cases/` | Casos de uso que orquestan la lógica |
| **Infrastructure** | `core/infrastructure/` | Implementaciones con Supabase (repositorios, DB client) |

**Regla de dependencia:** Domain no depende de nadie. Application depende de Domain. Infrastructure implementa interfaces de Domain.

### Entidades (`core/domain/entities/`)

- `Gasto.ts` — id, motivo, monto, cantidad_cuotas, categoria_id, usuario_id, tarjeta_id, createdAt
- `Usuario.ts` — id, usuario, password
- `Tarjeta.ts` — id, nombre, tipo, usuario_id
- `Categorias.ts` — Categoria (id, nombre)
- `Ingreso.ts` — id, monto, categoria_id, descripcion, usuario_id, createdAt
- `Reembolso.ts` — id, gasto_id, usuario_id, monto, de_quien, descripcion, createdAt

### Schemas Zod (`core/domain/schemas/`)

Cada dominio tiene un schema para validación:

- `gasto.schema.ts` → `GastoSchema`, `GastoInput`
- `ingreso.schema.ts` → `IngresoSchema`, `IngresoInput`
- `ingreso-filters.schema.ts` → `IngresoFiltersSchema`, `IngresoFiltersInput`
- `reembolso.schema.ts` → `ReembolsoSchema`, `ReembolsoInput`
- `resumen-filters.schema.ts` → `ResumenFiltersSchema`, `ResumenMensual`
- `tarjeta.schema.ts` → `TarjetaSchema`, `TarjetaInput`
- `usuario.schema.ts` → `UsuarioInputSchema`, `UsuarioInput`
- `categoria.schema.ts` → `CategoriaSchema`, `CategoriaInput`

**Convención:** `XxxSchema` para Zod, `XxxInput` como tipo inferido para input de creación/actualización.

### Repositorios

**Interfaces** (`core/domain/repositories/`):

- `IUsuarioRepository`, `IGastoRepository`, `IIngresoRepository`, `IReembolsoRepository`, `ITarjetaRepository`, `ICategoriaRepository`
- Nomenclatura: `I` + Nombre + `Repository`

**Implementaciones** (`core/infrastructure/repositories/`):

- `SupabaseUsuarioRepository`, `SupabaseGastoRepository`, etc.
- Nomenclatura: `Supabase` + Nombre + `Repository`
- Tablas Supabase: `usuarios`, `gastos`, `ingresos`, `reembolsos`, `tarjetas`, `categorias`

Los repositorios **no validan**; asumen datos ya validados por el caso de uso.

### Casos de Uso (`core/application/uses-cases/`)

Patrón general:

```typescript
export class CreateXxx {
  constructor(private xxxRepository: IXxxRepository) {}
  async execute(input: unknown) {
    const validation = XxxSchema.safeParse(input);
    if (!validation.success) throw new Error("...");
    return await this.xxxRepository.create(validation.data);
  }
}
```

- Reciben el repositorio por constructor.
- Validan con Zod dentro del `execute`.
- Delegan al repositorio para persistencia/lectura.
- Nomenclatura: verbo + sustantivo (`CreateGasto`, `GetTarjetas`, `LoginUser`).

---

## 3. Server Actions

### Ubicación

`app/_actions/<entidad>/actions.ts` — carpeta `_actions` con prefijo `_` (no ruta pública).

### Directiva

```typescript
"use server";
```

**Importante:** usar comillas dobles correctas. Evitar typos como `'use server";'`.

### Patrón de implementación

1. **Mutaciones** (crear, actualizar, eliminar):
   - Retorno: `Promise<ActionState>`
   - `ActionState`: `{ success: boolean; message: string } | null` (definido en `lib/interfaces.ts`)

2. **Lecturas**:
   - Retorno: tipo concreto (ej. `Promise<Tarjeta[]>`, `Promise<Categoria[]>`)

3. **Inyección de dependencias local**:
   ```typescript
   const repository = new SupabaseXxxRepository();
   const useCase = new CreateXxx(repository);
   await useCase.execute(data);
   ```

4. **Validación:**
   - **La Server Action no valida con Zod.** El caso de uso es el encargado de validar.
   - La action extrae datos (`Object.fromEntries(formData.entries())`) y los pasa al use case.
   - Si la validación falla, el use case lanza y la action captura y retorna `{ success: false, message }`.

5. **Manejo de errores:**
   - Mutaciones: `try/catch` y retornar `{ success: false, message: (error as Error).message }`
   - No lanzar errores al cliente en mutaciones; devolver `ActionState`.

6. **FormData:**
   - Solo extraer con `Object.fromEntries(formData.entries())` y pasar al use case.
   - La conversión de tipos (string → number) se maneja en el schema del caso de uso (ej. `z.coerce.number()`).

### Nomenclatura

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Mutación | `xxxAction` | `createGastoAction`, `registerAction` |
| Lectura | `getXxx` | `getTarjetas`, `getCategorias` |

### Acciones con `useActionState`

Para formularios que usan `useActionState`, la firma incluye `prevState`:

```typescript
export async function registerAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState>
```

---

## 4. Rutas y Layouts

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `app/page.tsx` | AuthForm (login/registro) |
| `/home` | `app/home/page.tsx` | HomeDashboard: ResumenCard, GastosModule, IngresosModule (tabs), TarjetaForm |
| `/home/tarjetas` | `app/home/tarjetas/page.tsx` | TarjetasView: tarjetas seleccionables + GastoTable filtrado |
| `/home/settings` | — | Referenciada en sidebar; puede no existir |

- Layout raíz: fuentes, Toaster, UserProvider.
- Layout `/home`: SidebarProvider, AppSidebar, AppHeader.

---

## 5. Aliases e Importaciones

- `@/*` → raíz del proyecto (`tsconfig.json`)
- `@/core/`, `@/app/`, `@/components/`, `@/context/`, `@/lib/`, `@/hooks/`

---

## 6. Resumen de Convenciones

| Concepto | Convención |
|----------|------------|
| Entidades | PascalCase, singular |
| Schemas | `XxxSchema`, `XxxInput` |
| Interfaces de repositorio | `IXxxRepository` |
| Implementaciones | `SupabaseXxxRepository` |
| Casos de uso | Verbo + Sustantivo (`CreateGasto`, `GetTarjetas`) |
| Server Actions mutación | `xxxAction` |
| Server Actions lectura | `getXxx` |
| Formularios | `XxxForm`, `XxxFormModal` |

---

## 7. Checklist para nuevas funcionalidades

**Nueva entidad/caso de uso completo:**

1. Entidad en `core/domain/entities/`
2. Schema en `core/domain/schemas/`
3. Interfaz de repositorio en `core/domain/repositories/`
4. Implementación en `core/infrastructure/repositories/`
5. Caso de uso en `core/application/uses-cases/`
6. Server Action en `app/_actions/<entidad>/actions.ts`

**Solo nueva Server Action (entidad ya existe):**

1. Crear o extender `app/_actions/<entidad>/actions.ts`
2. Inyectar repositorio y caso de uso
3. Usar `"use server"` y retornar `ActionState` o tipo adecuado
