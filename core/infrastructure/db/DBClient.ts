import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/**
 * Con RLS habilitado, el rol anon no tiene permisos.
 * Se usa SUPABASE_SERVICE_ROLE_KEY en servidor (Server Actions) para acceder a la DB.
 * NUNCA exponer la Service Role Key al cliente.
 */
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error(
    "Falta SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env"
  );
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
