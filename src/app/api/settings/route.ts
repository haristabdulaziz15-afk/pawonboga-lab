import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server-auth";
import { Role } from "@prisma/client";

export async function GET() {
  const rows = await prisma.setting.findMany();
  const map: Record<string,string> = {};
  for (const r of rows) map[r.key] = r.value;
  return NextResponse.json(map);
}

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (user?.role !== Role.ADMIN && user?.role !== Role.PENGELOLA_TOKO) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const entries = Object.entries(body || {});
  for (const [key, value] of entries) {
    await prisma.setting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } });
  }
  return NextResponse.json({ ok: true });
}
