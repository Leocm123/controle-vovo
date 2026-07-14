"use client";

/**
 * Aviso exibido quando as variáveis de ambiente do Supabase ainda não foram
 * configuradas. Evita telas de erro confusas antes do banco estar conectado.
 */
export default function ConfigNotice() {
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-900">
      <p className="text-lg font-semibold">Banco de dados não conectado</p>
      <p className="mt-2 text-base">
        Configure as variáveis <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (no arquivo{" "}
        <code>.env.local</code> ou nas configurações da Vercel) para começar a
        usar o aplicativo.
      </p>
    </div>
  );
}
