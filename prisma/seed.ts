import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = ["Makanan", "Aksesoris", "Perawatan", "Mainan", "Kandang"];

const seedProducts = [
  { id: "pf-001", nama: "NutriPaws Salmon & Rice 1.5kg", kategori: "Makanan", harga: 85000, stok: 24, deskripsi: "Pakan kering kucing dewasa kaya Omega-3 untuk bulu lembut dan pencernaan sehat.", imageUrl: "/products/pf-001.jpg", unggulan: true },
  { id: "pf-002", nama: "Kalung Lonceng Reflektif Pastel", kategori: "Aksesoris", harga: 22000, stok: 40, deskripsi: "Bahan nilon lembut anti-cekik dengan gesper pengaman dan lonceng nyaring.", imageUrl: "/products/pf-002.jpg", unggulan: false },
  { id: "pf-003", nama: "Sampo Organik Aloe & Oatmeal 250ml", kategori: "Perawatan", harga: 54000, stok: 15, deskripsi: "Formula lembut bebas sulfat untuk meredakan kulit gatal pada anjing dan kucing.", imageUrl: "/products/pf-003.jpg", unggulan: true },
  { id: "pf-004", nama: "Tongkat Bulu Interaktif Cat Teaser", kategori: "Mainan", harga: 18500, stok: 32, deskripsi: "Mainan pancing bulu ayam alami dengan gagang lentur untuk melatih kelincahan kucing.", imageUrl: "/products/pf-004.jpg", unggulan: false },
  { id: "pf-005", nama: "Kandang Lipat Besi Size L (75x45x55cm)", kategori: "Kandang", harga: 265000, stok: 4, deskripsi: "Rangka besi tebal anti-karat lengkap dengan tatakan kotoran plastik yang mudah dicuci.", imageUrl: "/products/pf-005.jpg", unggulan: true },
  { id: "pf-006", nama: "Dental Chew Stick Rasa Ayam (Isi 10)", kategori: "Makanan", harga: 35000, stok: 19, deskripsi: "Camilan pembersih karang gigi anjing sekaligus menyegarkan napas.", imageUrl: "/products/pf-006.jpg", unggulan: false },
  { id: "pf-007", nama: "Sisir Slicker Self-Cleaning Grooming", kategori: "Perawatan", harga: 42000, stok: 3, deskripsi: "Sikat penghilang bulu rontok dengan tombol pelepas bulu otomatis sekali tekan.", imageUrl: "/products/pf-007.jpg", unggulan: false },
  { id: "pf-008", nama: "Tas Ransel Astronot Transparan", kategori: "Aksesoris", harga: 145000, stok: 0, deskripsi: "Tas travel anabul dengan ventilasi 9 lubang udara dan jendela kubah bening.", imageUrl: "/products/pf-008.jpg", unggulan: false },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: { slug: slugify(name) },
      create: { name, slug: slugify(name) },
    });
  }

  const catMap = Object.fromEntries((await prisma.category.findMany()).map((c) => [c.name, c.id]));
  for (const p of seedProducts) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        nama: p.nama,
        slug: `${slugify(p.nama)}-${p.id}`,
        kategoriId: catMap[p.kategori],
        kategoriNama: p.kategori,
        harga: p.harga,
        stok: p.stok,
        deskripsi: p.deskripsi,
        imageUrl: p.imageUrl || null,
        unggulan: p.unggulan,
        isActive: true,
      },
      create: {
        id: p.id,
        nama: p.nama,
        slug: `${slugify(p.nama)}-${p.id}`,
        kategoriId: catMap[p.kategori],
        kategoriNama: p.kategori,
        harga: p.harga,
        stok: p.stok,
        deskripsi: p.deskripsi,
        imageUrl: p.imageUrl || null,
        unggulan: p.unggulan,
        isActive: true,
      },
    });
  }

  await prisma.setting.upsert({
    where: { key: "wa_number" },
    update: {},
    create: { key: "wa_number", value: "6281200000000" },
  });

  const users: Array<{ email: string; passEnv: string; passDefault: string; name: string; role: Role }> = [
    { email: process.env.SEED_ADMIN_EMAIL || "admin@pawfriends.local", passEnv: "SEED_ADMIN_PASSWORD", passDefault: "Admin123!", name: "Administrator", role: Role.ADMIN },
    { email: process.env.SEED_PENGELOLA_EMAIL || "pengelola@pawfriends.local", passEnv: "SEED_PENGELOLA_PASSWORD", passDefault: "Pengelola123!", name: "Pengelola Toko", role: Role.PENGELOLA_TOKO },
    { email: process.env.SEED_PEMBELI_EMAIL || "pembeli@pawfriends.local", passEnv: "SEED_PEMBELI_PASSWORD", passDefault: "Pembeli123!", name: "Pembeli Contoh", role: Role.PEMBELI },
  ];
  for (const u of users) {
    const password = process.env[u.passEnv] || u.passDefault;
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.upsert({
      where: { email: u.email.toLowerCase() },
      update: { name: u.name, role: u.role, passwordHash: hash },
      create: { email: u.email.toLowerCase(), name: u.name, role: u.role, passwordHash: hash },
    });
  }

  console.log("Seed completed.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
