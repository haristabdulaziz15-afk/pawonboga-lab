import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server-auth";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function GET() {
  const user = await getSessionUser();
  if (user?.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (user?.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { name, email, password, role } = body;
  if (!name || !email || !password || !role) return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  if (!Object.values(Role).includes(role)) return NextResponse.json({ error: "Role tidak valid" }, { status: 400 });
  const exists = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } });
  if (exists) return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
  const hash = await bcrypt.hash(String(password), 10);
  const created = await prisma.user.create({ data: { name, email: String(email).toLowerCase(), passwordHash: hash, role }, select: { id: true, name: true, email: true, role: true } });
  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (user?.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = (await req.json()) as { id?: string; role?: Role; name?: string };
  const { id, role, name } = body;
  if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
  const data: { role?: Role; name?: string } = {};
  if (role && Object.values(Role).includes(role)) data.role = role;
  if (name) data.name = name;
  const updated = await prisma.user.update({ where: { id }, data, select: { id: true, name: true, email: true, role: true } });
  return NextResponse.json(updated);
}
