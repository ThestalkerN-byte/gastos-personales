import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

// Definición de una única instancia para ser exportada
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
);
