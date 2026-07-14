"use client";

import { monthLabel } from "@/lib/format";

type Props = {
  year: number;
  month: number; // 0-11
  onChange: (year: number, month: number) => void;
};

export default function MonthSwitcher({ year, month, onChange }: Props) {
  function shift(delta: number) {
    const d = new Date(year, month + delta, 1);
    onChange(d.getFullYear(), d.getMonth());
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl bg-surface p-2 shadow-sm">
      <button
        type="button"
        onClick={() => shift(-1)}
        aria-label="Mês anterior"
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl font-bold text-primary active:bg-slate-200"
      >
        ‹
      </button>
      <span className="text-lg font-semibold capitalize">
        {monthLabel(year, month)}
      </span>
      <button
        type="button"
        onClick={() => shift(1)}
        aria-label="Próximo mês"
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl font-bold text-primary active:bg-slate-200"
      >
        ›
      </button>
    </div>
  );
}
