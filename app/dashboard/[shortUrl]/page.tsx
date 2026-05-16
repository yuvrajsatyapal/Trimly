"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import ActivityCalendar from "@/components/ActivityCalendar";
import ClickChart from "@/components/ClickChart";
import {
  ActivityDay,
  fallback30Days,
  toActivityDays,
  toHeatmapDays,
} from "@/lib/analytics";
import {
  ArrowUpRight,
  CalendarBlank,
  CursorClick,
  LinkSimple,
  ArrowLeft,
  ChartBar,
  Flame,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useAllLink } from "@/app/hooks/useAllLinks";
import { useClickAnalytics } from "@/app/hooks/useClickAnalytics";
import { CopyField } from "@/components/copy-field";
import { StatCard } from "@/components/stats-card";


/* ─── Main Page ─── */
export default function LinkDetailPage() {
  const { shortUrl } = useParams();
  const shortUrlParam = Array.isArray(shortUrl) ? shortUrl[0] : shortUrl ?? "";

  const { data: links, isLoading } = useAllLink();
  const { data: analytics } = useClickAnalytics(shortUrlParam);

  const link = useMemo(
    () => links?.find((l) => l.shortUrl === shortUrlParam) ?? null,
    [links, shortUrlParam]
  );

  const last30Days = analytics?.last30Days ?? fallback30Days;
  const activityData = useMemo(() => toActivityDays(last30Days), [last30Days]);
  const heatmapData = useMemo(() => toHeatmapDays(last30Days), [last30Days]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shortFull = `${origin}/u/${link?.shortUrl ?? ""}`;

  const createdDate = link
    ? new Date(link.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-zinc-600 border-t-zinc-300 animate-spin" />
          <p className="text-zinc-500 text-sm tracking-wide">Loading link data…</p>
        </div>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-5xl">🔗</p>
          <h2 className="text-xl font-semibold text-white">Link not found</h2>
          <p className="text-zinc-500 text-sm">
            This short URL doesn't exist or was deleted.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pt-10">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-zinc-700/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors group w-fit"
        >
          <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
          All links
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono truncate">
              /{link.shortUrl}
            </h1>
            <p className="text-sm text-zinc-500 truncate">{link.longUrl}</p>
          </div>
          <Link
            href={`/u/${link.shortUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-900 text-sm font-medium transition-colors whitespace-nowrap"
          >
            Visit
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={<CursorClick size={20} />} label="Total Clicks" value={link.clicks ?? 0} accent />
          <StatCard icon={<CalendarBlank size={20} />} label="Created On" value={createdDate} />
          <StatCard icon={<LinkSimple size={20} />} label="Short Code" value={link.shortUrl} />
        </div>

        {/* Link Details + QR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <p className="text-sm text-zinc-500 font-mono truncate">{link.id}</p>
              </div>
            </div>

            <div className="pt-1 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
              <span>Last updated {new Date(link.updatedAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-4 items-center">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest self-start">
              QR Code
            </h2>
            <div className="bg-white rounded-xl p-4 shadow-lg shadow-black/40" data-qr>
              <QRCodeSVG value={shortFull} size={160} bgColor="#ffffff" fgColor="#0a0a0c" level="M" />
            </div>
            <button
              onClick={() => {
                const svg = document.querySelector("[data-qr] svg") as SVGSVGElement | null;
                if (!svg) { toast.error("QR not found"); return; }
                const svgString = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const img = new Image();
                const url = URL.createObjectURL(
                  new Blob([svgString], { type: "image/svg+xml;charset=utf-8" })
                );
                img.onload = () => {
                  canvas.width = 300;
                  canvas.height = 300;
                  ctx?.drawImage(img, 0, 0, 300, 300);
                  URL.revokeObjectURL(url);
                  const a = document.createElement("a");
                  a.href = canvas.toDataURL("image/png");
                  a.download = `${link.shortUrl}-qr.png`;
                  a.click();
                  toast.success("QR downloaded as PNG!");
                };
                img.src = url;
              }}
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Download QR
            </button>
            <p className="text-xs text-zinc-600 text-center">Scan to open the short link</p>
          </div>
        </div>

        {/* Charts — below the main grid */}
        <ClickChart data={activityData} total={link.clicks ?? 0} />
        <ActivityCalendar data={heatmapData} />

      </div>
    </div>
  );
}