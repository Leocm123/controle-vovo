"use client";

import { useCallback, useEffect, useState } from "react";
import MonthSwitcher from "@/components/MonthSwitcher";
import Calendar from "@/components/Calendar";
import ConfigNotice from "@/components/ConfigNotice";
import ErrorNotice from "@/components/ErrorNotice";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  Service,
  Entry,
  getServices,
  getMonthEntries,
  toggleEntry,
} from "@/lib/queries";
import { formatBRL, WEEKDAYS } from "@/lib/format";

function dayLabel(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const wd = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `${wd}, ${d}`;
}

export default function AgendaPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [services, setServices] = useState<Service[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, e] = await Promise.all([
        getServices(),
        getMonthEntries(year, month),
      ]);
      setServices(s);
      setEntries(e);
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

  function isPresent(serviceId: string, date: string): boolean {
    return entries.some((e) => e.service_id === serviceId && e.entry_date === date);
  }

  async function handleToggle(service: Service, date: string) {
    const present = isPresent(service.id, date);
    // Atualização otimista para resposta imediata.
    setEntries((prev) =>
      present
        ? prev.filter((e) => !(e.service_id === service.id && e.entry_date === date))
        : [
            ...prev,
            {
              id: `tmp-${service.id}-${date}`,
              service_id: service.id,
              entry_date: date,
              created_at: "",
            },
          ]
    );
    try {
      await toggleEntry(service.id, date, present);
    } catch (err) {
      console.error(err);
      alert("Não foi possível salvar. Verifique a internet e tente de novo.");
      load();
    }
  }

  const totalParcial = services.reduce((sum, s) => {
    const dias = entries.filter((e) => e.service_id === s.id).length;
    return sum + dias * Number(s.daily_value);
  }, 0);

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

      <p className="text-center text-base text-muted">
        Toque em um dia para marcar os serviços prestados.
      </p>

      {error && <ErrorNotice message={error} />}

      {loading ? (
        <p className="py-10 text-center text-muted">Carregando…</p>
      ) : (
        <Calendar
          year={year}
          month={month}
          services={services}
          entries={entries}
          onDayClick={setSelectedDate}
        />
      )}

      {/* Legenda das cores */}
      {services.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 rounded-2xl bg-surface p-3 shadow-sm">
          {services.map((s) => (
            <span key={s.id} className="flex items-center gap-2 text-base">
              <span
                className="h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              {s.name}
            </span>
          ))}
        </div>
      )}

      {/* Total parcial do mês */}
      <div className="rounded-2xl bg-surface p-4 text-center shadow-sm">
        <p className="text-base text-muted">Total parcial do mês</p>
        <p className="text-3xl font-bold text-primary">{formatBRL(totalParcial)}</p>
      </div>

      {/* Painel de marcação do dia (bottom sheet) */}
      {selectedDate && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setSelectedDate(null)}
        >
          <div
            className="w-full max-w-2xl rounded-t-3xl bg-surface p-5 pb-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold capitalize">{dayLabel(selectedDate)}</h2>
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                aria-label="Fechar"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-muted"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {services.map((s) => {
                const present = isPresent(s.id, selectedDate);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleToggle(s, selectedDate)}
                    className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-colors ${
                      present ? "text-white" : "bg-white text-foreground"
                    }`}
                    style={{
                      borderColor: s.color,
                      backgroundColor: present ? s.color : undefined,
                    }}
                  >
                    <span>
                      <span className="block text-lg font-semibold">{s.name}</span>
                      <span
                        className={`text-sm ${present ? "text-white/90" : "text-muted"}`}
                      >
                        {formatBRL(Number(s.daily_value))} por dia
                      </span>
                    </span>
                    <span className="text-2xl">{present ? "✓" : "+"}</span>
                  </button>
                );
              })}
              {services.length === 0 && (
                <p className="text-center text-muted">
                  Nenhum serviço cadastrado. Adicione em Ajustes.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
