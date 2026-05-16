"use client";

import Link from "next/link";
import { Copy, ArrowUpRight, Trash } from "@phosphor-icons/react";
import { signIn, useSession } from "next-auth/react";
import { useAllLink } from "../hooks/useAllLinks";
import type { Link as PrismaLink } from "@/lib/generated/prisma/browser";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { data: allLinks, isLoading, refetch } = useAllLink();

  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  // 🔹 Loading
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Loading...
      </div>
    );
  }

  // 🔹 Not logged in
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold">Login to continue</h1>
        <Button onClick={() => signIn("google")}>
          Login with Google
        </Button>
      </div>
    );
  }

  const totalClicks = (allLinks ?? []).reduce(
    (acc, l) => acc + (l.clicks ?? 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white">

      {/* 🔥 NAVBAR */}
      <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950">
        <h1 className="font-bold text-lg">Trimly</h1>

        <Link
          href="/"
          className="bg-white text-black px-4 py-2 text-sm font-semibold rounded"
        >
          + Create Link
        </Link>
      </div>

      {/* 🔥 MAIN */}
      <div className="p-8 max-w-7xl mx-auto">

        {/* 🔥 STATS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded">
            <p className="text-sm text-zinc-500">Total Links</p>
            <h3 className="text-xl font-bold">
              {allLinks?.length || 0}
            </h3>
          </div>

          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded">
            <p className="text-sm text-zinc-500">Total Clicks</p>
            <h3 className="text-xl font-bold">{totalClicks}</h3>
          </div>

          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded">
            <p className="text-sm text-zinc-500">Active Links</p>
            <h3 className="text-xl font-bold">
              {allLinks?.length || 0}
            </h3>
          </div>
        </div>

        {/* 🔥 TABLE */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-zinc-500">
              Loading links...
            </div>
          ) : allLinks?.length === 0 ? (
            <div className="p-10 text-center text-zinc-500">
              No links yet. Create your first one 🚀
            </div>
          ) : (
            allLinks?.map((link: PrismaLink) => (
              <div
                key={link.shortUrl}
                onClick={() =>
                  router.push(`/dashboard/${link.shortUrl}`)
                }
                className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 hover:bg-zinc-900 transition cursor-pointer"
              >
                {/* LEFT */}
                <div className="max-w-[50%]">
                  <p className="font-semibold">
                    {window.location.origin}/u/{link.shortUrl}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {link.longUrl}
                  </p>
                </div>

                {/* CENTER */}
                <div className="text-sm text-zinc-400">
                  {link.clicks || 0} clicks
                </div>

                {/* RIGHT ACTIONS */}
                <div
                  className="flex items-center gap-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* COPY */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/u/${link.shortUrl}`
                      );
                      toast.success("Copied!");
                    }}
                  >
                    <Copy size={18} />
                  </button>

                  {/* OPEN */}
                  <a href={`/u/${link.shortUrl}`} target="_blank">
                    <ArrowUpRight size={18} />
                  </a>

                  {/* DELETE */}
                  <button
                    onClick={async () => {
                      setDeleting(link.shortUrl);
                      try {
                        const res = await fetch("/api/short", {
                          method: "DELETE",
                          body: JSON.stringify({
                            short_url: link.shortUrl,
                          }),
                        });

                        if (res.ok) {
                          toast.success("Deleted");
                          refetch();
                        } else {
                          toast.error("Failed");
                        }
                      } catch {
                        toast.error("Error deleting");
                      } finally {
                        setDeleting(null);
                      }
                    }}
                    disabled={deleting === link.shortUrl}
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}