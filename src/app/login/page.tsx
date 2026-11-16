"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { redirect: false, email, password, callbackUrl });
    setLoading(false);
    if (res?.error) { setError("Email atau password salah."); return; }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto mt-10 card p-6">
      <h1 className="text-2xl font-bold mb-1">Masuk</h1>
      <p className="text-brand-300 text-sm mb-6">Akses akun Admin, Pengelola Toko, atau Pembeli.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <div className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded p-2">{error}</div>}
        <div><label className="label">Email</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
        <div><label className="label">Password</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
        <button disabled={loading} className="btn btn-primary w-full">{loading ? "Memproses..." : "Masuk"}</button>
      </form>
      <p className="text-sm text-brand-300 mt-4">Belum punya akun pembeli? <Link href="/register" className="text-brand-300 hover:underline">Daftar</Link></p>
    </div>
  );
}
