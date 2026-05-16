import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
}

export function StatCard({ icon, label, value, accent = false }: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-6 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
        accent
          ? "bg-zinc-800/60 border-zinc-600/40 shadow-zinc-900/20"
          : "bg-zinc-900/60 border-zinc-800/60"
      }`}
    >
      {accent && (
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5 blur-2xl" />
      )}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          accent ? "bg-zinc-700 text-zinc-200" : "bg-zinc-800 text-zinc-400"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-3xl font-bold tracking-tight text-white truncate">
          {value}
        </p>
      </div>
    </div>
  );
}