"use client";

import { useCallback, useEffect, useState } from "react";
import MonthSwitcher from "@/components/MonthSwitcher";
import ConfigNotice from "@/components/ConfigNotice";
import ErrorNotice from "@/components/ErrorNotice";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  Service,
  Entry,
  Settings,
  getServices,
  getMonthEntries,
  getSettings,
} from "@/lib/queries";
import { formatBRL } from "@/lib/format";

export default function DashboardPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [services, setServices] = useState<Service[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, e, cfg] = await Promise.all([
        getServices(),
        getMonthEntries(year, month),
        getSettings(),
      ]);
      setServices(s);
      setEntries(e);
      setSettings(cfg);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    if (isSupabaseConfigured) load();
  }, [load]);

  const perService = services.map((s) => {
    const dias = entries.filter((e) => e.service_id === s.id).length;
    const subtotal = dias * Number(s.daily_value);
    return { service: s, dias, subtotal };
  });

  const total = perService.reduce((sum, r) => sum + r.subtotal, 0);
  const numPeople = settings?.num_people ?? 4;
  const perPerson = numPeople > 0 ? total / numPeople : total;

  if (!isSupabaseConfigured) return <ConfigNotice />;

  return (
    <div className="flex flex-col gap-4">
      <MonthSwitcher
        year={year}
        month={month}
        onChange={(y, m) => {
          setYear(y);
          setMonth(m);
        }}
      />

      {error && <ErrorNotice message={error} />}

      {loading ? (
        <p className="py-10 text-center text-muted">Carregando…</p>
      ) : (
        <>
          {/* Cartão por serviço */}
          {perService.map(({ service, dias, subtotal }) => (
            <div
              key={service.id}
              className="rounded-2xl bg-surface p-4 shadow-sm"
              style={{ borderLeft: `6px solid ${service.color}` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">{service.name}</span>
                <span className="text-2xl font-bold">{formatBRL(subtotal)}</span>
              </div>
              <p className="mt-1 text-base text-muted">
                {dias} {dias === 1 ? "dia" : "dias"} ×{" "}
                {formatBRL(Number(service.daily_value))} por dia
              </p>
            </div>
          ))}

          {perService.length === 0 && (
            <p className="text-center text-muted">
              Nenhum serviço cadastrado. Adicione em Ajustes.
            </p>
          )}

          {/* Total do mês */}
          <div className="rounded-2xl bg-slate-800 p-5 text-center text-white shadow-md">
            <p className="text-base text-slate-300">Total do mês</p>
            <p className="text-4xl font-bold">{formatBRL(total)}</p>
          </div>

          {/* Valor por pessoa (destaque) */}
          <div className="rounded-2xl bg-primary p-6 text-center text-white shadow-lg">
            <p className="text-lg">
              Cada pessoa paga{" "}
              <span className="font-semibold">(dividido por {numPeople})</span>
            </p>
            <p className="mt-1 text-5xl font-extrabold">{formatBRL(perPerson)}</p>
          </div>
        </>
      )}
    </div>
  );
}
