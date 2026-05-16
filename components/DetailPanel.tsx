"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Trash, X } from "@phosphor-icons/react";
import { toast } from "sonner";
import type { Link as PrismaLink } from "@/lib/generated/prisma/browser";


export default function DetailPanel ({
  link,
  onClose,
  refetch,
}: {
  link: PrismaLink;
  onClose: () => void;
  refetch: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg">Link Details</h2>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* SHORT URL */}
      <div className="mb-4">
        <p className="text-xs text-zinc-500 mb-1">Short URL</p>
        <div className="flex items-center justify-between bg-zinc-800 p-3 rounded">
          <span className="text-sm truncate">
            {window.location.origin}/u/{link.shortUrl}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/u/${link.shortUrl}`
              );
            }}
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* CLICKS */}
      <div className="mb-4">
        <p className="text-xs text-zinc-500">Clicks</p>
        <h3 className="text-xl font-bold">{link.clicks || 0}</h3>
      </div>

      {/* CREATED */}
      <div className="mb-4">
        <p className="text-xs text-zinc-500">Created</p>
        <p className="text-sm">
          {new Date(link.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* LONG URL */}
      <div className="mb-6">
        <p className="text-xs text-zinc-500 mb-1">Destination</p>
        <p className="text-sm text-zinc-400 break-all">
          {link.longUrl}
        </p>
      </div>

      {/* QR */}
      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 rounded">
          <QRCodeSVG
            value={`${window.location.origin}/u/${link.shortUrl}`}
          />
        </div>
      </div>

      {/* DELETE */}
      <button
        className="w-full bg-red-600 hover:bg-red-700 py-2 rounded flex items-center justify-center gap-2"
        disabled={deleting}
        onClick={async () => {
          setDeleting(true);
          try {
            const res = await fetch("/api/short", {
              method: "DELETE",
              body: JSON.stringify({
                short_url: link.shortUrl,
              }),
            });

            if (res.ok) {
              toast.success("Deleted");
              onClose();
              refetch();
            } else {
              toast.error("Failed");
            }
          } catch {
            toast.error("Error deleting");
          } finally {
            setDeleting(false);
          }
        }}
      >
        <Trash size={16} />
        Delete Link
      </button>
    </div>
  );
}