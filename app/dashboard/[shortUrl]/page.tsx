"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Copy,
  ArrowUpRight,
  CalendarBlank,
  CursorClick,
  LinkSimple,
  ArrowLeft,
  CheckCircle,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import type { Link as PrismaLink } from "@/lib/generated/prisma/browser";

/* ─── Stat Card ─────────────────────────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
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

/* ─── Copy Field ─────────────────────────────────────────────── */
function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 hover:border-zinc-700 transition-colors min-w-0">
        <LinkSimple size={15} className="text-zinc-600 shrink-0" />
        <span className="flex-1 text-sm text-zinc-300 truncate font-mono min-w-0">
          {value}
        </span>
        <button
          onClick={handleCopy}
          className="shrink-0 w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-200 flex items-center justify-center text-zinc-400 transition-all duration-200"
          aria-label="Copy"
        >
          {copied ? (
            <CheckCircle size={15} weight="fill" className="text-emerald-400" />
          ) : (
            <Copy size={15} />
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function LinkDetailPage() {
  const { shortUrl } = useParams();
  const [link, setLink] = useState<PrismaLink | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const res = await fetch(`/api/short/${shortUrl}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setLink(data);
      } catch {
        toast.error("Failed to load link");
      } finally {
        setLoading(false);
      }
    };
    fetchLink();
  }, [shortUrl]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shortFull = `${origin}/u/${link?.shortUrl ?? ""}`;

  const createdDate = link
    ? new Date(link.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-zinc-600 border-t-zinc-300 animate-spin" />
          <p className="text-zinc-500 text-sm tracking-wide">Loading link data…</p>
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!link) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-5xl">🔗</p>
          <h2 className="text-xl font-semibold text-white">Link not found</h2>
          <p className="text-zinc-500 text-sm">
            This short URL doesn't exist or was deleted.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm transition-colors"
          >
            <ArrowLeft size={14} /> Back to dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pt-10">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden ">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-zinc-700/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Back link — sits on its own line, never competes ── */}
        <a
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors mb-6 group"
        >
          <ArrowLeft
            size={13}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          All links
        </a>

        {/* ── Header ── */}
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono truncate">
              /{link.shortUrl}
            </h1>
            <p className="text-sm text-zinc-500 truncate">{link.longUrl}</p>
          </div>

          <a
            href={`/u/${link.shortUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-900 text-sm font-medium transition-colors whitespace-nowrap"
          >
            Visit <ArrowUpRight size={14} />
          </a>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<CursorClick size={20} />}
            label="Total Clicks"
            value={link.clicks ?? 0}
            accent
          />
          <StatCard
            icon={<CalendarBlank size={20} />}
            label="Created On"
            value={createdDate}
          />
          <StatCard
            icon={<LinkSimple size={20} />}
            label="Short Code"
            value={link.shortUrl}
          />
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Link details panel */}
          <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-6">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
              Link Details
            </h2>

            <CopyField label="Short URL" value={shortFull} />

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Destination URL
              </label>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 hover:border-zinc-700 transition-colors">
                <p className="text-sm text-zinc-400 break-all font-mono leading-relaxed">
                  {link.longUrl}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Link ID
              </label>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                <p className="text-sm text-zinc-500 font-mono truncate">
                  {link.id}
                </p>
              </div>
            </div>

            <div className="pt-1 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
              <span>
                Last updated {new Date(link.updatedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>
          </div>

          {/* QR Code panel */}
          <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-4 items-center">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest self-start">
              QR Code
            </h2>

            <div className="bg-white rounded-xl p-4 shadow-lg shadow-black/40" data-qr>
              <QRCodeSVG
                value={shortFull}
                size={160}
                bgColor="#ffffff"
                fgColor="#0a0a0c"
                level="M"
              />
            </div>

            <button
              onClick={() => {
                const svgEl = document.querySelector("[data-qr] svg") as SVGElement | null;
                if (!svgEl) { toast.error("QR not found"); return; }
                const blob = new Blob([svgEl.outerHTML], { type: "image/svg+xml" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${link.shortUrl}-qr.svg`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("QR downloaded!");
              }}
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-medium transition-colors"
            >
              Download QR
            </button>

            <p className="text-xs text-zinc-600 text-center">
              Scan to open the short link
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}