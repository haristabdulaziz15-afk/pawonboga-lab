"use client";
import { useMemo, useState } from "react";
import { formatRupiah } from "@/lib/utils";
import ProductImage from "@/components/ProductImage";

type Product = {
  id: string; nama: string; kategoriNama: string; harga: number; stok: number;
  deskripsi?: string | null; imageUrl?: string | null; unggulan: boolean;
};

const CATEGORIES = ["Semua", "Makanan", "Aksesoris", "Perawatan", "Mainan", "Kandang"];

export default function CatalogClient({ initialProducts, waNumber }: { initialProducts: Product[]; waNumber: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Semua");
  const [sort, setSort] = useState("unggulan");

  const products = useMemo(() => {
    let list = [...initialProducts];
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(p => p.nama.toLowerCase().includes(s) || (p.deskripsi || "").toLowerCase().includes(s));
    }
    if (cat !== "Semua") list = list.filter(p => p.kategoriNama === cat);
    if (sort === "harga-asc") list.sort((a,b)=>a.harga-b.harga);
    else if (sort === "harga-desc") list.sort((a,b)=>b.harga-a.harga);
    else if (sort === "stok-desc") list.sort((a,b)=>b.stok-a.stok);
    else list.sort((a,b)=>Number(b.unggulan)-Number(a.unggulan));
    return list;
  }, [initialProducts, q, cat, sort]);

  function waLink(p: Product) {
    const text = encodeURIComponent(`Halo PawFriends, saya ingin memesan:\n- ${p.nama}\n- Kategori: ${p.kategoriNama}\n- Harga: ${formatRupiah(p.harga)}\n\nApakah produk masih tersedia?`);
    return `https://wa.me/${waNumber}?text=${text}`;
  }

  return (
    <div className="space-y-4">
      {initialProducts.length === 0 && (
        <div className="card p-4 border-brand-600/50 bg-brand-800/30 text-brand-100 text-sm">
          Database belum terhubung/terisi. Salin <code>.env.example</code> ke <code>.env</code>, atur <code>DATABASE_URL</code> MySQL, lalu jalankan <code>npm run db:setup</code> dan restart dev server.
        </div>
      )}
      <div className="card p-4 grid md:grid-cols-4 gap-3">
        <div className="md:col-span-2"><label className="label">Cari</label><input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari nama atau deskripsi..." /></div>
        <div><label className="label">Kategori</label><select className="input" value={cat} onChange={e=>setCat(e.target.value)}>{CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}</select></div>
        <div><label className="label">Urutkan</label><select className="input" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="unggulan">Unggulan</option><option value="harga-asc">Harga Terendah</option><option value="harga-desc">Harga Tertinggi</option><option value="stok-desc">Stok Terbanyak</option>
        </select></div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="card overflow-hidden flex flex-col">
            <div className="aspect-[4/3] bg-brand-800 flex items-center justify-center text-brand-400 text-sm">
              <ProductImage src={p.imageUrl} alt={p.nama} kategori={p.kategoriNama} />
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2 text-xs">
                {p.unggulan && <span className="px-2 py-0.5 rounded bg-brand-400/20 text-brand-200">Unggulan</span>}
                <span className="text-brand-300">{p.kategoriNama}</span>
              </div>
              <h3 className="font-semibold leading-snug">{p.nama}</h3>
              <p className="text-sm text-brand-300 line-clamp-2 flex-1">{p.deskripsi}</p>
              <div className="flex items-center justify-between mt-1">
                <div className="font-bold text-brand-200">{formatRupiah(p.harga)}</div>
                <div className={`text-xs ${p.stok === 0 ? 'text-red-400' : p.stok < 5 ? 'text-brand-300' : 'text-green-400'}`}>
                  {p.stok === 0 ? 'Habis' : p.stok < 5 ? `Stok menipis (${p.stok})` : `Stok ${p.stok}`}
                </div>
              </div>
              {p.stok > 0 ? (
                <a href={waLink(p)} target="_blank" rel="noreferrer" className="btn btn-primary mt-2 w-full">Pesan via WhatsApp</a>
              ) : (
                <button disabled className="btn btn-secondary mt-2 w-full">Stok Habis</button>
              )}
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && initialProducts.length > 0 && <div className="text-center text-brand-300 py-10">Tidak ada produk yang cocok.</div>}
    </div>
  );
}