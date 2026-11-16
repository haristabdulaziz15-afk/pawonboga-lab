# SPEC.md — PawFriends (Katalog & Dashboard Produk UMKM Hewan)

## 1. Tujuan
Membangun aplikasi web Single Page Application (SPA) ringan berbasis klien untuk memamerkan katalog produk UMKM kebutuhan hewan peliharaan (PawFriends) sekaligus menyediakan dashboard pengelolaan stok/produk secara lokal. Aplikasi dirancang sebagai proyek latihan 1 hari tanpa ketergantungan backend maupun autentikasi kompleks.

## 2. Pengguna
Aplikasi beroperasi pada satu perangkat dengan dua peran yang dapat diakses melalui perpindahan mode/tab secara langsung:
* **Calon Pembeli:** Menjelajahi katalog, mencari produk, menyaring kategori, mengurutkan harga/stok, melihat produk unggulan, serta memesan langsung melalui tautan WhatsApp.
* **Pengelola Toko:** Memantau ringkasan inventaris, menambah produk baru, mengubah informasi/stok/harga produk yang ada, menghapus produk, serta mereset data ke kondisi awal (seed data).

## 3. Daftar Fitur MVP
### A. Tampilan Katalog (Calon Pembeli)
* **Grid Katalog:** Menampilkan 8 produk contoh awal (*seed data*) dengan fallback placeholder SVG lokal apabila `imageUrl` kosong atau gagal dimuat.
* **Informasi Kartu Produk:** Menampilkan badge *Unggulan*, kategori, nama produk, deskripsi singkat, harga terformat dalam Rupiah (`Rp`), dan indikator ketersediaan stok (Tersedia / Stok Menipis / Habis).
* **Pencarian Real-time:** Pencarian berdasarkan kata kunci pada nama dan deskripsi produk (case-insensitive).
* **Filter Kategori:** Filter cepat berdasarkan kategori (`Semua`, `Makanan`, `Aksesoris`, `Perawatan`, `Mainan`, `Kandang`).
* **Sorting:** Pengurutan berdasarkan *Unggulan (Default)*, *Harga: Terendah ke Tertinggi*, *Harga: Tertinggi ke Terendah*, dan *Stok: Terbanyak*.
* **Integrasi Pesan WhatsApp:** Tombol "Pesan via WhatsApp" yang membuka `https://wa.me/...` dengan pesan otomatis berisi nama produk, kategori, dan harga. Tombol dinonaktifkan jika stok = 0.

### B. Dashboard Pengelola (CRUD & Inventaris)
* **Ringkasan Statistik:** Kartu metrik dinamis untuk Total Produk, Total Unit Stok, Jumlah Kategori Aktif, dan Jumlah Produk Unggulan.
* **Operasi CRUD Produk:**
  * **Create:** Tambah produk baru dengan validasi input.
  * **Read:** Tabel daftar seluruh produk beserta status stok dan tombol aksi.
  * **Update:** Edit data produk yang sudah ada melalui form modal/panel.
  * **Delete:** Hapus produk dengan konfirmasi dialog browser.
* **Persistensi Data:** Penyimpanan otomatis ke `localStorage` browser setiap terjadi perubahan data, dilengkapi tombol "Reset Data Contoh" untuk mengembalikan 8 data awal.

## 4. Data Model
Setiap entitas produk disimpan sebagai objek JSON di dalam array pada `localStorage` dengan key `pawfriends_products_v1`:

```json
{
  "id": "string (unik, misal: 'pf-001' atau timestamp)",
  "nama": "string (wajib, min 3 karakter)",
  "kategori": "string ('Makanan' | 'Aksesoris' | 'Perawatan' | 'Mainan' | 'Kandang')",
  "harga": "number (integer/float >= 0)",
  "stok": "number (integer >= 0)",
  "deskripsi": "string (opsional, deskripsi singkat produk)",
  "imageUrl": "string (opsional, URL gambar atau kosong untuk fallback lokal)",
  "unggulan": "boolean (true | false)"
}