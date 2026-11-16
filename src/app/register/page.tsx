"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
    const data = await res.json().catch(()=>({}));
    setLoading(false);
    if (!res.ok) { setError(data.error || "Gagal mendaftar"); return; }
    setOk(true);
    setTimeout(()=>router.push("/login"), 1200);
  }

  return (
    <div className="max-w-md mx-auto mt-10 card p-6">
      <h1 className="text-2xl font-bold mb-1">Daftar Pembeli</h1>
      <p className="text-brand-300 text-sm mb-6">Buat akun untuk memesan produk PawFriends.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <div className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded p-2">{error}</div>}
        {ok && <div className="text-sm text-green-400 bg-green-950/40 border border-green-900 rounded p-2">Pendaftaran berhasil. Mengalihkan ke halaman masuk...</div>}
        <div><label className="label">Nama</label><input className="input" value={name} onChange={e=>setName(e.target.value)} required /></div>
        <div><label className="label">Email</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
        <div><label className="label">Password</label><input className="input" type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required /></div>
        <button disabled={loading} className="btn btn-primary w-full">{loading ? "Memproses..." : "Daftar"}</button>
      </form>
      <p className="text-sm text-brand-300 mt-4">Sudah punya akun? <Link href="/login" className="text-brand-300 hover:underline">Masuk</Link></p>
    </div>
  );
}
