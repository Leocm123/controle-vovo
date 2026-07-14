"use client";

import { Service, Entry } from "@/lib/queries";
import { WEEKDAYS, daysInMonth, firstWeekday, dateStr } from "@/lib/format";

type Props = {
  year: number;
  month: number; // 0-11
  services: Service[];
  entries: Entry[];
  onDayClick: (date: string) => void;
};

export default function Calendar({ year, month, services, entries, onDayClick }: Props) {
  const total = daysInMonth(year, month);
  const offset = firstWeekday(year, month);

  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);

  function servicesOn(date: string): Service[] {
    return services.filter((s) =>
      entries.some((e) => e.service_id === s.id && e.entry_date === date)
    );
  }

  return (
    <div className="rounded-2xl bg-surface p-2 shadow-sm">
      <div className="mb-1 grid grid-cols-7">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1 text-center text-sm font-semibold text-muted">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`empty-${i}`} />;
          const date = dateStr(year, month, d);
          const active = servicesOn(date);
          return (
            <button
              key={date}
              type="button"
              onClick={() => onDayClick(date)}
              aria-label={`Dia ${d}${active.length ? `, ${active.length} serviço(s)` : ""}`}
              className="flex min-h-[64px] flex-col items-center gap-1 rounded-xl border border-border p-1 active:bg-slate-100"
            >
              <span className="text-base font-semibold">{d}</span>
              <span className="flex flex-wrap justify-center gap-1">
                {active.map((s) => (
                  <span
                    key={s.id}
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                    title={s.name}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
