"use client";

import { useEffect, useRef, useState } from "react";
import ConfigNotice from "@/components/ConfigNotice";
import ErrorNotice from "@/components/ErrorNotice";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  getServices,
  getSettings,
  createService,
  updateService,
  deleteService,
  updateNumPeople,
} from "@/lib/queries";

type EditableService = {
  key: string;
  id?: string;
  name: string;
  daily_value: string; // string para facilitar a edição no input
  color: string;
};

export default function ConfiguracoesPage() {
  const keyCounter = useRef(0);
  const nextKey = () => `k${keyCounter.current++}`;

  const [services, setServices] = useState<EditableService[]>([]);
  const [numPeople, setNumPeople] = useState("4");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [s, cfg] = await Promise.all([getServices(), getSettings()]);
      setServices(
        s.map((svc) => ({
          key: nextKey(),
          id: svc.id,
          name: svc.name,
          daily_value: String(svc.daily_value),
          color: svc.color,
        }))
      );
      setNumPeople(String(cfg.num_people));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isSupabaseConfigured) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateField(key: string, field: keyof EditableService, value: string) {
    setServices((prev) =>
      prev.map((s) => (s.key === key ? { ...s, [field]: value } : s))
    );
    setSaved(false);
  }

  function addService() {
    setServices((prev) => [
      ...prev,
      { key: nextKey(), name: "", daily_value: "0", color: "#7c3aed" },
    ]);
    setSaved(false);
  }

  async function removeService(item: EditableService) {
    const confirmar = window.confirm(
      `Remover "${item.name || "este serviço"}"? Os dias marcados desse serviço também serão apagados.`
    );
    if (!confirmar) return;
    try {
      if (item.id) await deleteService(item.id);
      setServices((prev) => prev.filter((s) => s.key !== item.key));
    } catch (err) {
      console.error(err);
      alert("Não foi possível remover. Tente novamente.");
    }
  }

  async function save() {
    setSaving(true);
    try {
      for (const s of services) {
        const value = parseFloat(s.daily_value.replace(",", ".")) || 0;
        const name = s.name.trim();
        if (!name) continue; // ignora linhas sem nome
        if (s.id) {
          await updateService(s.id, name, value, s.color);
        } else {
          await createService(name, value, s.color);
        }
      }
      await updateNumPeople(parseInt(numPeople, 10) || 1);
      await load(); // recarrega para obter ids novos
      setSaved(true);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : String(err));
      alert("Não foi possível salvar. Veja o detalhe do erro na tela.");
    } finally {
      setSaving(false);
    }
  }

  if (!isSupabaseConfigured) return <ConfigNotice />;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold">Serviços e valores</h2>

      {error && <ErrorNotice message={error} />}

      {loading ? (
        <p className="py-10 text-center text-muted">Carregando…</p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {services.map((s) => (
              <div key={s.key} className="rounded-2xl bg-surface p-4 shadow-sm">
                <label className="block text-sm font-medium text-muted">
                  Nome do serviço
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={s.color}
                    onChange={(e) => updateField(s.key, "color", e.target.value)}
                    aria-label="Cor do serviço"
                    className="h-11 w-11 shrink-0 rounded-lg border border-border"
                  />
                  <input
                    type="text"
                    value={s.name}
                    onChange={(e) => updateField(s.key, "name", e.target.value)}
                    placeholder="Ex: Cuidadora"
                    className="w-full rounded-lg border border-border p-3 text-lg"
                  />
                </div>

                <label className="mt-3 block text-sm font-medium text-muted">
                  Valor por dia (R$)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={s.daily_value}
                  onChange={(e) => updateField(s.key, "daily_value", e.target.value)}
                  placeholder="0,00"
                  className="mt-1 w-full rounded-lg border border-border p-3 text-lg"
                />

                <button
                  type="button"
                  onClick={() => removeService(s)}
                  className="mt-3 text-base font-medium text-red-600"
                >
                  Remover serviço
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addService}
            className="rounded-2xl border-2 border-dashed border-border p-4 text-lg font-medium text-primary"
          >
            + Adicionar serviço
          </button>

          <div className="rounded-2xl bg-surface p-4 shadow-sm">
            <label className="block text-lg font-semibold">
              Dividir o custo entre quantas pessoas?
            </label>
            <input
              type="number"
              min={1}
              inputMode="numeric"
              value={numPeople}
              onChange={(e) => {
                setNumPeople(e.target.value);
                setSaved(false);
              }}
              className="mt-2 w-full rounded-lg border border-border p-3 text-lg"
            />
          </div>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-2xl bg-primary p-4 text-xl font-bold text-white shadow-md disabled:opacity-60"
          >
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>

          {saved && (
            <p className="text-center text-lg font-medium text-green-700">
              ✓ Alterações salvas!
            </p>
          )}
        </>
      )}
    </div>
  );
}
