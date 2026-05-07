"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function SiteHeader({ className }: { className?: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b border-zinc-800/70 bg-background/80 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tighter text-foreground"
        >
          TRIMLY
        </Link>

        {session ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-[10px] tracking-widest text-zinc-500 uppercase sm:inline">
              {session.user?.name ?? session.user?.email ?? "Signed in"}
            </span>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-zinc-300 hover:text-white"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button
              size="sm"
              className="px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase"
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            className="px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase"
            onClick={() => signIn("google")}
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
}