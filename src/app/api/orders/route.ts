import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/server-auth";
import { Role } from "@prisma/client";
import { orderCode } from "@/lib/utils";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role === Role.PEMBELI) {
    const orders = await prisma.order.findMany({ where: { buyerId: user.id }, include: { items: true }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(orders);
  }
  // admin & pengelola see all
  const orders = await prisma.order.findMany({ include: { items: true, buyer: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(orders);
}

type OrderItemInput = { productId: string; qty: number | string };
type CreateOrderBody = { items?: OrderItemInput[]; note?: string; buyerName?: string; buyerPhone?: string; buyerAddress?: string };

export async function POST(req: Request) {
  const user = await getSessionUser();
  const body = (await req.json()) as CreateOrderBody;
  const { items, note, buyerName, buyerPhone, buyerAddress } = body;
  if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "Item pesanan kosong" }, { status: 400 });

  const ids = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: ids }, isActive: true } });
  const map = new Map(products.map(p => [p.id, p]));
  let total = 0;
  const orderItems: { productId: string; productNama: string; kategoriNama: string; harga: number; qty: number; subtotal: number }[] = [];
  for (const it of items) {
    const p = map.get(it.productId);
    const qty = Math.max(1, parseInt(String(it.qty), 10) || 1);
    if (!p) return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 400 });
    if (p.stok < qty) return NextResponse.json({ error: `Stok tidak cukup untuk ${p.nama}` }, { status: 400 });
    const subtotal = p.harga * qty;
    total += subtotal;
    orderItems.push({ productId: p.id, productNama: p.nama, kategoriNama: p.kategoriNama, harga: p.harga, qty, subtotal });
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        code: orderCode(),
        buyerId: user?.id ?? null,
        buyerName: buyerName || user?.name || "Pelanggan",
        buyerPhone: buyerPhone || null,
        buyerAddress: buyerAddress || null,
        note: note || null,
        total,
        items: { create: orderItems },
      },
      include: { items: true },
    });
    for (const it of orderItems) {
      await tx.product.update({ where: { id: it.productId! }, data: { stok: { decrement: it.qty } } });
    }
    return created;
  });

  return NextResponse.json(order, { status: 201 });
}
