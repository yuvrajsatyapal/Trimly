"use client";

import { cn } from "@/lib/utils";
import { GithubLogo, EnvelopeSimple } from "@phosphor-icons/react";

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
            TRIMLY
          </div>
          <div className="text-[9px] tracking-widest text-zinc-500 uppercase">
            © {new Date().getFullYear()} TRIMLY. RELIABLE. FAST.
          </div>
        </div>

        <div className="flex items-center gap-4 text-zinc-500">
          <span className="text-[10px] tracking-widest uppercase">Connect</span>

          <div className="flex items-center gap-3 text-[10px] font-medium tracking-widest text-zinc-400">

            <a
              href="https://github.com/yuvrajsatyapal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <GithubLogo size={14} />
              GitHub
            </a>

            <span className="text-zinc-600">·</span>

            <a
              href="mailto:yuvrajsatyapal21@gmial.com"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <EnvelopeSimple size={14} />
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}