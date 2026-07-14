"use client";

/** Banner de erro legível, mostrado quando uma consulta ao banco falha. */
export default function ErrorNotice({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-300 bg-red-50 p-5 text-red-900">
      <p className="text-lg font-semibold">Ocorreu um erro ao acessar o banco</p>
      <p className="mt-2 break-words text-base">{message}</p>
      <p className="mt-3 text-sm text-red-700">
        Dica: verifique se você rodou o <code>schema.sql</code> no SQL Editor do
        Supabase e se a URL/chave no <code>.env.local</code> estão corretas.
      </p>
    </div>
  );
}
