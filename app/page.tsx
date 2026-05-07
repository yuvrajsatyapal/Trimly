"use client";

import { useMemo, useState } from "react";
import {
  Globe,
  Lightning,
  LinkSimple,
  Lock,
  Scissors,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useShortUrl } from "./hooks/useShortUrl";
import { z } from "zod";
import Link from "next/link";
import { useHeroStats } from "./hooks/useHeroStats";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function Home() {
  const { shortUrl, isLoading, newUrl } = useShortUrl();
  const [url, setUrl] = useState("");
  const { data: heroStats } = useHeroStats();
  const { data: session } = useSession();
  const isValidUrl = useMemo(() => z.url().safeParse(url.trim()), [url]);
  const canSubmit = isValidUrl.success || url.length !== 0;

  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-background text-foreground">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-0 z-100 opacity-[0.03]",
          "bg-[image:url(https://lh3.googleusercontent.com/aida-public/AB6AXuDLitToQ8P2ErYblwEX2DwiJ-33hAZqxhaE6bzZE3V8UpNtx_KYkAoCmoJaWAzeDOUnjCzzxPTvofWUEOHsvCPZNM9fDjoY8-UFmUhZPJqE5Bl6V4jiavII4HPRxRiNguOpy_AJIlC0AysaPrEuoP6NQmolpreA4uiUGMgxdbr2k3sE8K8xKkP1CKbZDR41NdoGLFalzbgbtjXDZPo-GKHbL9d37EoHtIUkZvU0vQPDT2lvg0lA8fhMR41TdTB0D3kMJ1sON7sIDsw)] bg-center bg-cover bg-no-repeat"
        )}
      />

      <main className="relative flex-1">
        <section
          id="shorten"
          className={cn(
            "relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6",
            "bg-[radial-gradient(1200px_800px_at_top_left,#18181b_0%,#0e0e10_70%)]"
          )}
        >
          <div className="z-10 mx-auto max-w-4xl text-center ">
            <h1 className="mx-auto mb-6 max-w-3xl text-5xl font-bold leading-[0.9] tracking-tighter md:text-7xl">
              <span className="bg-linear-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                SHORTEN YOUR LINKS, BROADEN YOUR REACH.
              </span>
            </h1>

            <p className="mx-auto mb-12 max-w-xl text-sm tracking-widest text-zinc-500 uppercase leading-relaxed md:text-base">
              Enter long URL, make it short in seconds, share, unlimited free.
            </p>

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-2 border border-zinc-800/70 bg-zinc-900/40 p-1.5 shadow-2xl sm:flex-row">
              <div className="flex flex-1 items-center gap-3 border border-zinc-800/70 bg-background px-4 transition-colors focus-within:border-zinc-500">
                <LinkSimple size={18} className="text-zinc-500" />
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://very-long-url-to-be-shortened.com/xyz..."
                  className="h-12 border-0 bg-transparent px-0 text-sm text-foreground placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <Button
                className="h-12 gap-2 px-8 text-xs font-bold tracking-widest uppercase"
                disabled={!canSubmit || isLoading}
                onClick={() => {
                  if (session) {
                    shortUrl(url);
                  } else {
                    toast.error("Please login to shorten your URL");
                  }
                }}
              >
                Shorten
                <Scissors size={16} />
              </Button>
            </div>
          </div>
          <div className="w-full flex justify-center items-center mt-3 text-sm text-zinc-500">
            {newUrl ? (
              <Link target="_blank" className="hover:underline" href={newUrl}>
                {newUrl}
              </Link>
            ) : isLoading ? (
              <>Shortening...</>
            ) : (
              <>
                <p>Your shortened URL will appear here</p>
              </>
            )}
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #27272a 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </section>

        <section className="border-y border-zinc-800/70 bg-zinc-950/40 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-2 md:text-left">
              <div className=" border border-zinc-800/70 bg-background p-8">
                <div className="mb-2 text-[10px] tracking-widest text-zinc-500 uppercase">
                  Network activity
                </div>
                <div className="text-5xl font-bold tracking-tighter text-foreground">
                  <span className="text-zinc-700">
                    {heroStats?.totalLinks || 0}
                  </span>
                </div>
                <p className="mt-4 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                  Links Shortened
                </p>
              </div>
              <div className=" border border-zinc-800/70 bg-background p-8">
                <div className="mb-2 text-[10px] tracking-widest text-zinc-500 uppercase">
                  Global traffic
                </div>
                <div className="text-5xl font-bold tracking-tighter text-foreground">
                  <span className="text-zinc-700">
                    {heroStats?.totalClicks || 0}
                  </span>
                </div>
                <p className="mt-4 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                  Total Clicks
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background px-6 py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 text-3xl font-bold tracking-tighter text-foreground uppercase leading-tight">
              No tracking. No fluff.
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-sm tracking-widest text-zinc-500 uppercase leading-relaxed">
              Designed for minimalists who need reliable link management without
              the overhead of enterprise marketing suites.
            </p>

            <div className="flex items-center justify-center gap-8 text-zinc-600">
              <div className="flex items-center gap-2">
                <Lightning size={16} className="text-zinc-500" />
                <span className="text-[10px] font-bold tracking-tighter uppercase">
                  Fast
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-zinc-500" />
                <span className="text-[10px] font-bold tracking-tighter uppercase">
                  Secure
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-zinc-500" />
                <span className="text-[10px] font-bold tracking-tighter uppercase">
                  Free
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}