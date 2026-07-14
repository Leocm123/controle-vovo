import { createClient } from "@supabase/supabase-js";

// Remove espaços/quebras de linha e barras no final, que causam caminhos
// inválidos nas requisições (erro PGRST125).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "");
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

/** Indica se as variáveis de ambiente do Supabase foram configuradas. */
export const isSupabaseConfigured = Boolean(url && anonKey);

// Usa placeholders quando não configurado para não quebrar o build/import.
// As chamadas só funcionam de fato após definir as variáveis de ambiente.
export const supabase = createClient(
  url ?? "https://placeholder.supabase.co",
  anonKey ?? "placeholder-anon-key"
);
