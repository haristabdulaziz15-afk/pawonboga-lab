"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  return (
    <header className="border-b border-brand-800 bg-brand-950/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-extrabold text-lg text-brand-300">PawFriends</Link>
        <nav className="flex items-center gap-3 text-sm flex-wrap justify-end">
          <Link href="/" className="hover:text-brand-200">Katalog</Link>
          {status === "authenticated" && (role === "ADMIN" || role === "PENGELOLA_TOKO") && (
            <Link href="/dashboard" className="hover:text-brand-200">Dashboard</Link>
          )}
          {status === "authenticated" && role === "ADMIN" && (
            <Link href="/admin/users" className="hover:text-brand-200">Admin</Link>
          )}
          {status === "authenticated" && role === "PEMBELI" && (
            <Link href="/orders" className="hover:text-brand-200">Pesanan Saya</Link>
          )}
          {status === "authenticated" ? (
            <>
              <span className="text-brand-300 hidden sm:inline">{session.user?.name} ({role})</span>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="px-3 py-1.5 rounded bg-brand-800 hover:bg-brand-700">Keluar</button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-1.5 rounded bg-brand-800 hover:bg-brand-700">Masuk</Link>
              <Link href="/register" className="px-3 py-1.5 rounded bg-brand-400 text-brand-950 font-semibold hover:bg-brand-300">Daftar</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
