"use client";
import { useEffect, useState } from "react";

type U = { id: string; name: string; email: string; role: string; createdAt?: string };
const roles = ["ADMIN", "PENGELOLA_TOKO", "PEMBELI"];

export default function AdminUsersClient() {
  const [users, setUsers] = useState<U[]>([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "PENGELOLA_TOKO" });

  async function load() {
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    if (res.ok) setUsers(await res.json()); else setMsg("Gagal memuat user (pastikan login sebagai Admin).");
  }
  useEffect(()=>{ load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    const res = await fetch("/api/admin/users", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(form) });
    const data = await res.json().catch(()=>({}));
    if (!res.ok) { setMsg(data.error||"Gagal membuat user"); return; }
    setMsg("User dibuat."); setForm({ name: "", email: "", password: "", role: "PENGELOLA_TOKO" }); load();
  }
  async function changeRole(id: string, role: string) {
    const res = await fetch("/api/admin/users", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ id, role }) });
    if (res.ok) { setMsg("Role diperbarui."); load(); } else setMsg("Gagal update role.");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin — Manajemen User</h1>
      <p className="text-brand-300 text-sm">Hanya <b>Admin</b> yang dapat mengelola akun dan role (Admin, Pengelola Toko, Pembeli).</p>
      {msg && <div className="card p-3 text-sm border-brand-700 bg-brand-800/40 text-brand-100">{msg}</div>}

      <div className="card p-4">
        <h2 className="font-semibold mb-3">Buat User Baru</h2>
        <form onSubmit={create} className="grid md:grid-cols-2 gap-3">
          <div><label className="label">Nama</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
          <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
          <div><label className="label">Password</label><input className="input" type="password" minLength={6} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required /></div>
          <div><label className="label">Role</label><select className="input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>{roles.map(r=> <option key={r} value={r}>{r}</option>)}</select></div>
          <div className="md:col-span-2"><button className="btn btn-primary" type="submit">Buat User</button></div>
        </form>
      </div>

      <div className="card p-4 overflow-x-auto">
        <h2 className="font-semibold mb-3">Daftar User</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-brand-300 border-b border-brand-800"><tr><th className="py-2">Nama</th><th>Email</th><th>Role</th><th>Ubah Role</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-brand-900">
                <td className="py-2">{u.name}</td><td>{u.email}</td><td><span className="px-2 py-0.5 rounded bg-brand-800">{u.role}</span></td>
                <td>
                  <select className="input text-sm py-1" value={u.role} onChange={e=>changeRole(u.id, e.target.value)}>
                    {roles.map(r=> <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {users.length===0 && <tr><td colSpan={4} className="py-6 text-center text-brand-400">Belum ada data.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}