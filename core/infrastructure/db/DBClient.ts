import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// Definición de una única instancia para ser exportada
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
);
