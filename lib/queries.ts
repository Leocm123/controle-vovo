import { supabase } from "./supabase";
import { monthRange } from "./format";

/** Converte o erro do Supabase (que imprime como {}) numa Error legível. */
function asError(error: {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
}): Error {
  const parts = [error?.message, error?.details, error?.hint, error?.code].filter(
    Boolean
  );
  return new Error(parts.join(" — ") || "Erro desconhecido ao acessar o banco.");
}

export type Service = {
  id: string;
  name: string;
  daily_value: number;
  color: string;
  active: boolean;
  created_at: string;
};

export type Entry = {
  id: string;
  service_id: string;
  entry_date: string; // "YYYY-MM-DD"
  created_at: string;
};

export type Settings = {
  id: number;
  num_people: number;
};

/** Lista os serviços ativos, em ordem de criação. */
export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: true });
  if (error) throw asError(error);
  return (data ?? []) as Service[];
}

/** Registros de serviços prestados dentro de um mês. `month` é 0-11. */
export async function getMonthEntries(year: number, month: number): Promise<Entry[]> {
  const { start, end } = monthRange(year, month);
  const { data, error } = await supabase
    .from("service_entries")
    .select("*")
    .gte("entry_date", start)
    .lte("entry_date", end);
  if (error) throw asError(error);
  return (data ?? []) as Entry[];
}

/** Marca ou desmarca um serviço num dia. */
export async function toggleEntry(
  serviceId: string,
  entryDate: string,
  currentlyPresent: boolean
): Promise<void> {
  if (currentlyPresent) {
    const { error } = await supabase
      .from("service_entries")
      .delete()
      .match({ service_id: serviceId, entry_date: entryDate });
    if (error) throw asError(error);
  } else {
    const { error } = await supabase
      .from("service_entries")
      .insert({ service_id: serviceId, entry_date: entryDate });
    if (error) throw asError(error);
  }
}

/** Configurações gerais (linha única, id = 1). */
export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw asError(error);
  return data as Settings;
}

/** Atualiza o número de pessoas que dividem o custo. */
export async function updateNumPeople(numPeople: number): Promise<void> {
  const { error } = await supabase
    .from("app_settings")
    .update({ num_people: numPeople })
    .eq("id", 1);
  if (error) throw asError(error);
}

/** Cria um novo serviço. */
export async function createService(
  name: string,
  dailyValue: number,
  color: string
): Promise<void> {
  const { error } = await supabase
    .from("services")
    .insert({ name, daily_value: dailyValue, color });
  if (error) throw asError(error);
}

/** Atualiza nome, valor e cor de um serviço. */
export async function updateService(
  id: string,
  name: string,
  dailyValue: number,
  color: string
): Promise<void> {
  const { error } = await supabase
    .from("services")
    .update({ name, daily_value: dailyValue, color })
    .eq("id", id);
  if (error) throw asError(error);
}

/** Remove um serviço (e seus registros, via cascade). */
export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw asError(error);
}
