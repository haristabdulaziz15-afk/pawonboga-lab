import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, canManageProducts } from "@/lib/server-auth";
import { slugify } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1";
  if (all) {
    const user = await getSessionUser();
    if (!canManageProducts(user?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const products = await prisma.product.findMany({ orderBy: [{ updatedAt: "desc" }] });
    return NextResponse.json(products);
  }
  const products = await prisma.product.findMany({ where: { isActive: true }, orderBy: [{ unggulan: "desc" }, { createdAt: "desc" }] });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!canManageProducts(user?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { nama, kategoriNama, harga, stok, deskripsi, imageUrl, unggulan } = body;
  if (!nama || String(nama).trim().length < 3) return NextResponse.json({ error: "Nama minimal 3 karakter" }, { status: 400 });
  const cat = await prisma.category.findUnique({ where: { name: kategoriNama } });
  const id = `pf-${Date.now()}`;
  const product = await prisma.product.create({
    data: {
      id,
      nama: String(nama).trim(),
      slug: `${slugify(nama)}-${id}`,
      kategoriId: cat?.id,
      kategoriNama: kategoriNama || "Lainnya",
      harga: Math.max(0, Number(harga) || 0),
      stok: Math.max(0, parseInt(stok, 10) || 0),
      deskripsi: deskripsi || null,
      imageUrl: imageUrl || null,
      unggulan: !!unggulan,
    },
  });
  return NextResponse.json(product, { status: 201 });
}
