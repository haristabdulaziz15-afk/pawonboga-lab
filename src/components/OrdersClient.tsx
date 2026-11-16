"use client";
import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/utils";

type OrderItem = { id: string; productNama: string; qty: number; subtotal: number };
type Order = { id: string; code: string; createdAt: string; status: string; total: number; buyerName: string; buyerPhone?: string | null; note?: string | null; items?: OrderItem[] };

export default function OrdersClient({ role }: { role: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [msg, setMsg] = useState("");
  async function load() {
    const res = await fetch("/api/orders", { cache: "no-store" });
    if (res.ok) setOrders(await res.json()); else setMsg("Gagal memuat pesanan.");
  }
  useEffect(()=>{ load(); }, []);
  const title = role === "PEMBELI" ? "Pesanan Saya" : "Daftar Pesanan (Toko)";
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-brand-300 text-sm">Pembeli melihat riwayat pesanannya. Admin & Pengelola Toko dapat memantau seluruh pesanan masuk.</p>
      {msg && <div className="card p-3 text-sm text-brand-100">{msg}</div>}
      <div className="space-y-3">
        {orders.map(o => (
          <div key={o.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div><div className="font-semibold">{o.code}</div><div className="text-xs text-brand-300">{new Date(o.createdAt).toLocaleString("id-ID")} • {o.status}</div></div>
              <div className="font-bold text-brand-200">{formatRupiah(o.total)}</div>
            </div>
            <div className="text-sm text-brand-200 mb-1">Pemesan: {o.buyerName} {o.buyerPhone ? `(${o.buyerPhone})` : ""}</div>
            {o.note && <div className="text-sm text-brand-300 mb-2">Catatan: {o.note}</div>}
            <ul className="text-sm list-disc pl-5 text-brand-200">
              {o.items?.map((it) => <li key={it.id}>{it.productNama} × {it.qty} — {formatRupiah(it.subtotal)}</li>)}
            </ul>
          </div>
        ))}
        {orders.length === 0 && <div className="card p-6 text-center text-brand-400">Belum ada pesanan.</div>}
      </div>
    </div>
  );
}