"use server";

import { SupabaseUsuarioRepository } from "@/core/infrastructure/repositories/SupabaseUsuarioRepository";
import { CreateUser } from "@/core/application/uses-cases/CreateUser";
import { ActionState } from "@/lib/interfaces";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { LoginUser } from "@/core/application/uses-cases/LoginUser";

export async function registerAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  console.log(
    "Datos recibidos en el servidor:",
    Object.fromEntries(formData.entries()),
  );
  // 1. Inyección de dependencias
  const repository = new SupabaseUsuarioRepository();
  console.log("Repositorio creado:", repository);
  const useCase = new CreateUser(repository);
  console.log("Caso de uso creado:", useCase);
  // 2. Extracción de datos
  const data = Object.fromEntries(formData.entries());

  try {
    // 3. Ejecución del caso de uso (que ya valida con Zod e interactúa con Infra)
    await useCase.execute(data);

    // Si el flujo continúa aquí, es que fue exitoso
    return { success: true, message: "Usuario creado correctamente" };
  } catch (error: unknown) {
    // Retornamos el error para que la UI lo muestre
    return { success: false, message: (error as Error).message };
  }
}
export async function loginAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  console.log(
    "Datos recibidos en el servidor para login:",
    Object.fromEntries(formData.entries()),
  );
  // 1. Inyección de dependencias
  const repository = new SupabaseUsuarioRepository();
  console.log("Repositorio creado para login:", repository);
  const useCase = new LoginUser(repository);
  console.log("Caso de uso creado para login:", useCase);
  // 2. Extracción de datos
  const data = Object.fromEntries(formData.entries());
  // 3. Boolean para el redirect
  let isSuccess = false;
  try {
    // 3. Ejecución del caso de uso (que ya valida con Zod e interactúa con Infra)
    const user = await useCase.execute(data);
    console.log("Resultado del login:", user);
    // Si el flujo continúa es porque fue exitoso
    const cookieStore = await cookies();
    cookieStore.set("user_session", JSON.stringify(user), {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    });

    isSuccess = true;
  } catch (error: unknown) {
    // Retornamos el error para que la UI lo muestre
    return { success: false, message: (error as Error).message };
  }
  // revalidatePath("/home"); // Revalida ladashboard para actualizar el estado de autenticación
  if (isSuccess) {
    redirect("/home");
  }
  return { success: isSuccess, message: "Login exitoso" };
}
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
  redirect('/');
}


export async function setCookiesAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const data = Object.fromEntries(formData.entries());
  const cookieStore = await cookies();
  cookieStore.set("name", data.usuario as string);
  return { success: true, message: "Cookie establecida" };
}
