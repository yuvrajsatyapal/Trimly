import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { long_url } = await req.json()
  const isUrl = z.url().safeParse(long_url)

  if (!isUrl.success) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  const existingLink = await prisma.link.findFirst({ where: { longUrl: long_url } })
  if (existingLink) {
    return NextResponse.json({ short_url: `${process.env.NEXT_PUBLIC_APP_URL}/u/${existingLink.shortUrl}` }, { status: 200 })
  }

  const short_url = nanoid(10)
  const link = await prisma.link.create({
    data: {
      longUrl: long_url,
      shortUrl: short_url,
      owner: {
        connect: {
          id: session.user.id
        }
      }
    }
  })

  return NextResponse.json({ short_url: `${process.env.NEXT_PUBLIC_APP_URL}/u/${link.shortUrl}` }, { status: 201 })
}

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const allLinks = await prisma.link.findMany({ where: { owner: { id: session.user.id } } })
  return NextResponse.json({ allLinks }, { status: 200 })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { short_url } = await req.json()
  await prisma.link.delete({ where: { shortUrl: short_url, owner: { id: session.user.id } } })
  return NextResponse.json({ message: "Link deleted successfully" }, { status: 200 })
}