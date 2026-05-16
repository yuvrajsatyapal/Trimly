"use client"

import { useMemo } from "react";
import { ActivityDay } from "@/lib/analytics";
import { ChartBar } from "@phosphor-icons/react";

export default function ClickChart({ data, total }: { data: ActivityDay[]; total: number }) {
  const max = useMemo(() => Math.max(...data.map((d) => d.clicks), 1), [data]);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ChartBar size={18} className="text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">
            7-Day Activity
          </h2>
        </div>
        <span className="text-xs text-zinc-500 bg-zinc-800/60 px-2.5 py-1 rounded-md font-medium">
          {total.toLocaleString()} total clicks
        </span>
      </div>
      <div className="flex items-end gap-3 h-44 px-1">
        {data.map((day, i) => {
          const heightPct = (day.clicks / max) * 100;
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="relative w-full flex items-end justify-center h-32">
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-xs py-1 px-2 rounded-lg border border-zinc-700 whitespace-nowrap z-10 pointer-events-none shadow-xl">
                  {day.clicks.toLocaleString()} clicks
                </div>
                <div
                  className="w-full max-w-[40px] bg-gradient-to-t from-indigo-500/20 to-indigo-500 rounded-t-md transition-all duration-700 ease-out relative overflow-hidden"
                  style={{
                    height: `${Math.max(heightPct, 4)}%`,
                    transitionDelay: `${i * 80}ms`,
                  }}
                />
              </div>
              <span className="text-[10px] text-zinc-500 font-medium">{day.dayName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}