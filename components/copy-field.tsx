"use client";

import { useState } from "react";
import { Copy, CheckCircle, LinkSimple } from "@phosphor-icons/react";
import { toast } from "sonner";

interface CopyFieldProps {
  label: string;
  value: string;
}

export function CopyField({ label, value }: CopyFieldProps) {
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
          className="shrink-0 w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-200 flex items-center justify-center text-zinc-400 transition-all duration-200 cursor-pointer"
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