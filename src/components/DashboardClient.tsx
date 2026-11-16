"use client";
import { useEffect, useMemo, useState } from "react";
import { formatRupiah } from "@/lib/utils";

type Product = { id: string; nama: string; kategoriNama: string; harga: number; stok: number; deskripsi?: string | null; imageUrl?: string | null; unggulan: boolean; isActive: boolean };
const CATS = ["Makanan", "Aksesoris", "Perawatan", "Mainan", "Kandang"];
const emptyForm = { nama: "", kategoriNama: "Makanan", harga: 0, stok: 0, deskripsi: "", imageUrl: "", unggulan: false };

export default function DashboardClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [wa, setWa] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([fetch("/api/products?all=1", { cache: "no-store" }).then(r=>r.ok?r.json():fetch("/api/products").then(x=>x.json())), fetch("/api/settings")]);
      const p = await pRes; const s = await sRes.json().catch(()=>({}));
      setProducts(Array.isArray(p)?p:[]);
      setWa((s as { wa_number?: string }).wa_number || "");
    } catch { setMsg("Gagal memuat data. Pastikan DB sudah disetup."); }
    setLoading(false);
  }
  useEffect(()=>{ load(); }, []);

  const stats = useMemo(()=>{
    const totalProduk = products.length;
    const totalStok = products.reduce((a,p)=>a+(p.stok||0),0);
    const kategoriAktif = new Set(products.map(p=>p.kategoriNama)).size;
    const unggulan = products.filter(p=>p.unggulan).length;
    return { totalProduk, totalStok, kategoriAktif, unggulan };
  }, [products]);

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    const payload = { ...form, harga: Number(form.harga)||0, stok: Number.parseInt(String(form.stok),10)||0 };
    const url = editing ? `/api/products/${editing}` : "/api/products";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type":"application/json" }, body: JSON.stringify(payload) });
    const data = await res.json().catch(()=>({}));
    if (!res.ok) { setMsg(data.error || "Gagal menyimpan"); return; }
    setMsg(editing ? "Produk diperbarui." : "Produk ditambahkan.");
    setForm(emptyForm); setEditing(null); load();
  }
  async function del(id: string) {
    if (!confirm("Hapus produk ini?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg("Produk dihapus."); load(); } else setMsg("Gagal hapus.");
  }
  function edit(p: Product) { setEditing(p.id); setForm({ nama:p.nama, kategoriNama:p.kategoriNama, harga:p.harga, stok:p.stok, deskripsi:p.deskripsi||"", imageUrl:p.imageUrl||"", unggulan:!!p.unggulan }); window.scrollTo({top:0,behavior:'smooth'}); }
  async function saveWa() {
    const res = await fetch("/api/settings", { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ wa_number: wa }) });
    setMsg(res.ok ? "Nomor WhatsApp disimpan." : "Gagal menyimpan nomor WA.");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Pengelola</h1>
      <p className="text-brand-300 text-sm">Akses: <b>Admin</b> & <b>Pengelola Toko</b>. Kelola produk, stok, dan pengaturan toko.</p>
      {msg && <div className="card p-3 text-sm border-brand-700 bg-brand-800/40 text-brand-100">{msg}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4"><div className="text-brand-300 text-xs">Total Produk</div><div className="text-2xl font-bold">{stats.totalProduk}</div></div>
        <div className="card p-4"><div className="text-brand-300 text-xs">Total Unit Stok</div><div className="text-2xl font-bold">{stats.totalStok}</div></div>
        <div className="card p-4"><div className="text-brand-300 text-xs">Kategori Aktif</div><div className="text-2xl font-bold">{stats.kategoriAktif}</div></div>
        <div className="card p-4"><div className="text-brand-300 text-xs">Produk Unggulan</div><div className="text-2xl font-bold">{stats.unggulan}</div></div>
      </div>

      <div className="card p-4 space-y-3">
        <h2 className="font-semibold">Pengaturan Nomor WhatsApp Toko</h2>
        <div className="flex gap-2 flex-col sm:flex-row"><input className="input" value={wa} onChange={e=>setWa(e.target.value)} placeholder="62812xxxx" /><button onClick={saveWa} className="btn btn-secondary">Simpan</button></div>
      </div>

      <div className="card p-4">
        <h2 className="font-semibold mb-3">{editing ? "Edit Produk" : "Tambah Produk Baru"}</h2>
        <form onSubmit={saveProduct} className="grid md:grid-cols-2 gap-3">
          <div className="md:col-span-2"><label className="label">Nama Produk</label><input className="input" value={form.nama} onChange={e=>setForm({...form,nama:e.target.value})} required minLength={3} /></div>
          <div><label className="label">Kategori</label><select className="input" value={form.kategoriNama} onChange={e=>setForm({...form,kategoriNama:e.target.value})}>{CATS.map(c=> <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Harga (Rp)</label><input type="number" className="input" value={form.harga} onChange={e=>setForm({...form,harga:Number(e.target.value)||0})} min={0} /></div>
          <div><label className="label">Stok</label><input type="number" className="input" value={form.stok} onChange={e=>setForm({...form,stok:Number(e.target.value)||0})} min={0} /></div>
          <div><label className="label">Image URL (opsional)</label><input className="input" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} /></div>
          <div className="md:col-span-2"><label className="label">Deskripsi</label><textarea className="input" rows={3} value={form.deskripsi} onChange={e=>setForm({...form,deskripsi:e.target.value})} /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.unggulan} onChange={e=>setForm({...form,unggulan:e.target.checked})} /> Produk Unggulan</label>
          <div className="md:col-span-2 flex gap-2">
            <button className="btn btn-primary" type="submit">{editing?"Simpan Perubahan":"Tambah Produk"}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={()=>{setEditing(null);setForm(emptyForm);}}>Batal</button>}
          </div>
        </form>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3"><h2 className="font-semibold">Daftar Inventaris</h2><button onClick={load} className="btn btn-secondary text-sm">Refresh</button></div>
        {loading ? <div className="text-brand-300">Memuat...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-brand-300 border-b border-brand-800"><tr><th className="py-2">Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Aksi</th></tr></thead>
              <tbody>
                {products.map(p=> (
                  <tr key={p.id} className="border-b border-brand-900">
                    <td className="py-2 pr-2"><div className="font-medium">{p.nama}</div>{p.unggulan && <span className="text-xs text-brand-300">Unggulan</span>}</td>
                    <td>{p.kategoriNama}</td><td>{formatRupiah(p.harga)}</td><td>{p.stok}</td>
                    <td className="space-x-2 whitespace-nowrap"><button className="text-brand-300 hover:underline" onClick={()=>edit(p)}>Edit</button><button className="text-red-400 hover:underline" onClick={()=>del(p.id)}>Hapus</button></td>
                  </tr>
                ))}
                {products.length===0 && <tr><td colSpan={5} className="py-6 text-center text-brand-400">Belum ada data.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}