import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Controle Vovô",
  description: "Agenda e controle de gastos com Cuidadora e Fisioterapia",
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="bg-primary text-white shadow-md">
          <div className="mx-auto max-w-2xl px-4 py-4">
            <h1 className="text-2xl font-bold tracking-tight">Controle Vovô</h1>
          </div>
        </header>

        {/* pb-28 garante espaço para a navegação fixa inferior */}
        <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-5 pb-28">
          {children}
        </main>

        <BottomNav />
      </body>
    </html>
  );
}
