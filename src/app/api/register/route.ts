import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    if (String(password).length < 6) return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    const exists = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } });
    if (exists) return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email: String(email).toLowerCase(), passwordHash: hash, role: Role.PEMBELI },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal mendaftar" }, { status: 500 });
  }
}