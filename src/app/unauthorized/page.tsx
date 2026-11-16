import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="max-w-lg mx-auto mt-16 card p-8 text-center">
      <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1>
      <p className="text-brand-300 mb-6">Akun Anda tidak memiliki izin untuk membuka halaman ini. Role yang tersedia: <b>Admin</b>, <b>Pengelola Toko</b>, <b>Pembeli</b>.</p>
      <Link href="/" className="btn btn-primary">Kembali ke Katalog</Link>
    </div>
  );
}