"use client"

import{ HeatmapDay } from "@/lib/analytics";
import { Flame } from "@phosphor-icons/react";

export default function ActivityCalendar({ data }: { data: HeatmapDay[] }) {
  const levels = [
    "bg-zinc-900",
    "bg-emerald-900/40",
    "bg-emerald-800/60",
    "bg-emerald-700/80",
    "bg-emerald-500",
  ];

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Flame size={18} className="text-zinc-400" />
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">
          30-Day Heatmap
        </h2>
      </div>
      <div className="grid grid-cols-10 gap-1.5">
        {data.map((day) => (
          <div
            key={day.date}
            className={`aspect-square rounded-md ${levels[day.intensity]} transition-all hover:scale-110 hover:ring-1 hover:ring-zinc-600 relative group cursor-default`}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-700 pointer-events-none z-20">
              {day.date} — {day.clicks} clicks
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 text-[10px] text-zinc-600">
        <span>Less</span>
        <div className="flex gap-1">
          {levels.map((l, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${l}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}