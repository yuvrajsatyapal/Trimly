"use client";

import Link from "next/link";
import { ArrowUpRight, Copy } from "@phosphor-icons/react/dist/ssr";
import { signIn, useSession } from "next-auth/react";
import { useAllLink } from "../hooks/useAllLinks";
import type { Link as PrismaLink } from "@/lib/generated/prisma/browser";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const bgNoiseStyle = {
  backgroundImage:
    "url(https://lh3.googleusercontent.com/aida-public/AB6AXuD24LSYMz6LeYYMOxSmzBLE6DLsZw0H9l52s-RTlrNw-N5CJzCKnPEK-UyoaAQWyKtU7bsflsCDygIFiC_cdBNg1yLtPnMBDgy_VGKfVeN6xFzoEXGATXo9K8xwjwV674hOyyRqATnfVktcPoiA1PMjAec_B5iBGx2Rkz1V8WW6fwFtxNkQH7-BSyNHjUUyMgEHcM3ysqgA7J8CavRYy46SqvaC578sB6rh5W5dcKcanHNaNamd1X4rPzwTRm1RhmBDojIulLuvUa0)",
} as const;

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0e0e10] text-[#e7e4ec] pt-[50px]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={bgNoiseStyle}
      />
      <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_top_left,#18181b_0%,#0e0e10_70%)]" />
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const {
    data: allLinks,
    isLoading: allLinksLoading,
    refetch: refetchAllLinks,
  } = useAllLink();
  const [currentLink, setCurrentLink] = useState<PrismaLink | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  if (status === "loading") {
    return (
      <DashboardShell>
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <p className="font-mono text-sm text-zinc-500">Loading…</p>
        </div>
      </DashboardShell>
    );
  }

  if (!session) {
    return (
      <DashboardShell>
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-6">
          <div className="mx-auto max-w-md text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-500">
              Dashboard
            </p>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-100 md:text-3xl">
              Login to manage your links
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              Your short links and click stats show up here after you sign in
              with Google.
            </p>
            <Button
              className="mt-8 px-6 text-[10px] font-bold uppercase tracking-widest"
              onClick={() => signIn("google")}
            >
              Login with Google
            </Button>
            <p className="mt-6">
              <Link
                href="/"
                className="text-sm text-zinc-400 underline-offset-4 transition hover:text-zinc-200 hover:underline"
              >
                Back to home
              </Link>
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-[320px] border-r border-zinc-800/50 bg-zinc-950/40 p-6 lg:block">
          <div className="mt-8 space-y-2">
            {allLinksLoading ? (
              <div>Loading...</div>
            ) : (
              allLinks?.map((link: PrismaLink) => (
                <button
                  key={link.shortUrl}
                  onClick={() => setCurrentLink(link)}
                  className="group w-full border border-transparent bg-transparent px-4 py-4 text-left transition hover:border-zinc-800 hover:bg-zinc-900/80"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-mono text-lg font-semibold tracking-tight text-zinc-200">
                      {link.shortUrl}
                    </p>
                    <ArrowUpRight className="text-zinc-500 transition group-hover:text-zinc-300" />
                  </div>
                  <p className="mt-1 truncate font-mono text-xs text-zinc-500">
                    {link.longUrl}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        {currentLink ? (
          <main className="flex flex-1 items-center justify-center px-6 py-16 lg:px-16">
            <div className="w-full max-w-2xl">
              <div className="mb-10 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-500">
                  Active Link Asset
                </p>
                <h1 className="mt-4 text-xl font-black tracking-tighter md:text-4xl">
                  {currentLink?.shortUrl}
                </h1>
                <h2 className="text-2xl font-bold text-zinc-200 my-3 bg-zinc-800/50 p-4">
                  {currentLink?.clicks || 0} clicks
                </h2>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Created{" "}
                  {new Date(currentLink?.createdAt ?? "").toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>

              <div className="mb-10 flex justify-center">
                <div className="border border-white/10 bg-white p-7 shadow-[0_0_40px_rgba(255,255,255,0.07)]">
                  <QRCodeSVG
                    value={`${window.location.origin}/u/${currentLink?.shortUrl}`}
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                    Short Alias
                  </p>
                  <div className="flex justify-between items-center gap-3 border border-zinc-700/60 bg-zinc-800/50 px-4 py-4">
                    <span className="font-mono text-sm font-semibold text-zinc-100">
                      {window.location.origin}/u/{currentLink?.shortUrl}
                    </span>
                    <button
                      onClick={() => {
                        window.navigator.clipboard.writeText(
                          `${window.location.origin}/u/${currentLink?.shortUrl}`
                        );
                        toast.success("Copied to clipboard");
                      }}
                    >
                      <Copy className="ml-auto text-zinc-400" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                    Destination Target
                  </p>
                  <div className="flex items-center gap-3 border border-zinc-800 bg-zinc-900/70 px-4 py-4">
                    <span className="truncate font-mono text-xs text-zinc-400">
                      {currentLink?.longUrl}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/"
                  className="bg-zinc-100 px-8 flex justify-center items-center font-semibold tracking-wide text-zinc-950 transition hover:bg-white h-[55px]"
                >
                  Create New Short Link
                </Link>

                <Dialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="ml-4 px-8 flex justify-center items-center font-semibold h-[55px]"
                    >
                      Delete Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your link and remove it from our database.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button
                        loading={isDeleting}
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={async () => {
                          setIsDeleting(true);
                          try {
                            const response = await fetch(`/api/short`, {
                              method: "DELETE",
                              body: JSON.stringify({
                                short_url: currentLink?.shortUrl,
                              }),
                            });
                            if (response.ok) {
                              toast.success("Link deleted successfully");
                              setDeleteDialogOpen(false);
                              setCurrentLink(null);
                              refetchAllLinks();
                            } else {
                              toast.error("Failed to delete link");
                            }
                          } catch {
                            toast.error("Failed to delete link");
                          } finally {
                            setIsDeleting(false);
                          }
                        }}
                      >
                        Confirm Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </main>
        ) : (
          <div className="w-full h-dvh flex justify-center items-center text-zinc-500 text-xl">
            No link selected
          </div>
        )}
      </div>
    </DashboardShell>
  );
}