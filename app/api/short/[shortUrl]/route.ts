import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shortUrl: string }> }
) {
  try {
    const { shortUrl } = await params;

    const link = await prisma.link.findUnique({
      where: { shortUrl },
    });

    if (!link) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const rawClicks = await prisma.click.findMany({
      where: {
        linkId: link.id,
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { createdAt: true },
    });

    const countByDate: Record<string, number> = {};
    for (const { createdAt } of rawClicks) {
      const key = createdAt.toISOString().split("T")[0];
      countByDate[key] = (countByDate[key] ?? 0) + 1;
    }

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (29 - i));
      const dateStr = d.toISOString().split("T")[0];
      return { date: dateStr, clicks: countByDate[dateStr] ?? 0 };
    });

    return NextResponse.json({ link, last30Days });

  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}