"use client";

import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "w-full border-t border-zinc-800/70 bg-background py-12",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-8 px-8 md:flex-row">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-bold tracking-tighter text-foreground">
            SHORTITOUT
          </div>
          <div className="text-[9px] tracking-widest text-zinc-500 uppercase">
            © {new Date().getFullYear()} SHORTITOUT INFRASTRUCTURE. OPEN SOURCE.
          </div>
        </div>

        <div className="flex items-center gap-4 text-zinc-500">
          <span className="text-[10px] tracking-widest uppercase">Nodes:</span>
          <span className="text-[10px] font-medium tracking-widest text-zinc-400 uppercase">
            Stable
          </span>
        </div>
      </div>
    </footer>
  );
}