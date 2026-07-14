// Utilidades de formatação e datas (pt-BR).

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// Abreviações dos dias da semana, começando no domingo.
export const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** Nome do mês por extenso + ano. `month` é 0-11. */
export function monthLabel(year: number, month: number): string {
  return `${MONTHS[month]} de ${year}`;
}

/** Formata um valor em Reais (BRL). */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

/** Quantidade de dias no mês. `month` é 0-11. */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Dia da semana (0=Dom ... 6=Sáb) do primeiro dia do mês. */
export function firstWeekday(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Monta uma data no formato "YYYY-MM-DD" sem depender de fuso horário. */
export function dateStr(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/** Intervalo de datas (primeiro e último dia) do mês, como strings. */
export function monthRange(year: number, month: number): { start: string; end: string } {
  return {
    start: dateStr(year, month, 1),
    end: dateStr(year, month, daysInMonth(year, month)),
  };
}
