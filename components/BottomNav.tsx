"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Agenda", icon: "📅" },
  { href: "/dashboard", label: "Resumo", icon: "💰" },
  { href: "/configuracoes", label: "Ajustes", icon: "⚙️" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface">
      <div className="mx-auto flex max-w-2xl">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-base font-medium transition-colors ${
                active ? "text-primary" : "text-muted"
              }`}
            >
              <span className="text-2xl leading-none" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
