import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PawFriends — Katalog & Manajemen UMKM Hewan",
  description: "Aplikasi production PawFriends: katalog produk, pemesanan, dan dashboard pengelolaan dengan 3 peran pengguna.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-gradient-to-b from-brand-950 via-brand-950 to-[#120c09] text-brand-100">
        <Providers>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
