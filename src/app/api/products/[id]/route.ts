import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, canManageProducts } from "@/lib/server-auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!canManageProducts(user?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { nama, kategoriNama, harga, stok, deskripsi, imageUrl, unggulan, isActive } = body;
  const cat = kategoriNama ? await prisma.category.findUnique({ where: { name: kategoriNama } }) : null;
  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      ...(nama ? { nama } : {}),
      ...(kategoriNama ? { kategoriNama, kategoriId: cat?.id } : {}),
      ...(harga !== undefined ? { harga: Math.max(0, Number(harga) || 0) } : {}),
      ...(stok !== undefined ? { stok: Math.max(0, parseInt(stok, 10) || 0) } : {}),
      ...(deskripsi !== undefined ? { deskripsi } : {}),
      ...(imageUrl !== undefined ? { imageUrl: imageUrl || null } : {}),
      ...(unggulan !== undefined ? { unggulan: !!unggulan } : {}),
      ...(isActive !== undefined ? { isActive: !!isActive } : {}),
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!canManageProducts(user?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
