"use client";
import {
  useState,
  useActionState,
  useEffect,
  useRef,
  startTransition,
} from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { loginAction, registerAction } from "@/app/_actions/user/actions";
import { toast } from "sonner";

export function AuthForm() {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [stateRegister, formPendingRegister, isPendingRegister] =
    useActionState(registerAction, null);
  const [stateLogin, formPendingLogin, isPendingLogin] = useActionState(
    loginAction,
    null,
  );
  const [tabView, setTabView] = useState<"login" | "register">("login");
  const formRef = useRef<HTMLFormElement>(null);

  const handleReset = (tabToRedirect: "login" | "register") => {
    formRef.current?.reset();
    setTabView(tabToRedirect);
  };

  useEffect(() => {
    console.log("Estado de registro:", stateRegister);
    if (stateRegister?.success) {
      // startTransition le dice a React que este cambio de estado es una "transición"
      // y no un renderizado síncrono crítico.
      startTransition(() => {
        handleReset("login");
      });
    }
    if (stateLogin?.success) {
      startTransition(() => {
        handleReset("login");
      });
    }
  }, [stateRegister, stateLogin]);

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg border border-border bg-card">
            <Lock className="size-5 text-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
            Bienvenido
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Inicia sesion o crea una cuenta para continuar
          </p>
        </div>

        <Tabs defaultValue={tabView} value={tabView} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger
              onClick={() => setTabView("login")}
              value="login"
              className="text-sm"
            >
              Iniciar sesion
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setTabView("register")}
              value="register"
              className="text-sm"
            >
              Registrarse
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <form
              ref={formRef}
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                console.log(formData, "formulario");
                const result = await loginAction(stateLogin, formData);
                console.log("Resultado del login:", result);
                if (result?.success) {
                  toast.success(result.message);
                }else{
                  toast.error(result?.message ?? "Error al iniciar sesion");
                }
              }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="login-user"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Usuario
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    name="usuario"
                    id="login-user"
                    type="text"
                    placeholder="Tu nombre de usuario"
                    className="h-10 pl-9 bg-secondary border-border placeholder:text-muted-foreground/50"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="login-password"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Contrasena
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    name="password"
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Tu contrasena"
                    className="h-10 pl-9 pr-10 bg-secondary border-border placeholder:text-muted-foreground/50"
                    autoComplete="current-password"
                  />
                  <button
                    disabled={isPendingLogin}
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showLoginPassword
                        ? "Ocultar contrasena"
                        : "Mostrar contrasena"
                    }
                  >
                    {showLoginPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                disabled={isPendingLogin}
                type="submit"
                className="mt-2 h-10 w-full text-sm font-medium"
              >
                Iniciar sesion
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <form
              ref={formRef}
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const result = await registerAction(stateRegister, formData);
                console.log("Resultado del registro:", result);
                if (result?.success) {
                  toast.success(result.message);
                  setTabView("login"); // Volver a la pestaña de login después de un registro exitoso
                }else{
                  toast.error(result?.message ?? "Error al crear cuenta");
                }
              }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="register-user"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Usuario
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    name="usuario"
                    id="register-user"
                    type="text"
                    placeholder="Elige un nombre de usuario"
                    className="h-10 pl-9 bg-secondary border-border placeholder:text-muted-foreground/50"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="register-password"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    name="password"
                    id="register-password"
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="Crea una contrasena"
                    className="h-10 pl-9 pr-10 bg-secondary border-border placeholder:text-muted-foreground/50"
                    autoComplete="new-password"
                  />
                  <button
                    disabled={isPendingRegister}
                    type="button"
                    onClick={() =>
                      setShowRegisterPassword(!showRegisterPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors "
                    aria-label={
                      showRegisterPassword
                        ? "Ocultar contrasena"
                        : "Mostrar contrasena"
                    }
                  >
                    {showRegisterPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                disabled={isPendingRegister}
                type="submit"
                className="mt-2 h-10 w-full text-sm font-medium cursor-pointer disabled:cursor-not-allowed disabled:text-muted-foreground/50"
              >
                Crear cuenta
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Al continuar, aceptas nuestros terminos de servicio y politica de
          privacidad.
        </p>
      </div>
    </div>
  );
}
