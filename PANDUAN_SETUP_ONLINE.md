# 🚀 Panduan Lengkap: Hosting Aplikasi Imbalan Kerja (Dari Nol)

Dokumen ini menjelaskan langkah-langkah teknis untuk membuat aplikasi Anda online, mulai dari pengaturan GitHub hingga pembuatan subdomain.

---

## 1. Persiapan GitHub (Pusat Kode)

Anda sudah memiliki folder `.git` di komputer. Sekarang kita hubungkan ke internet.

### A. Buat Repository di GitHub
1.  Buka [github.com](https://github.com) dan masuk ke akun Anda.
2.  Klik tombol **New** (Repository baru).
3.  Beri nama: `imbalan-kerja-app`.
4.  Pilih **Private** (agar kode Anda tidak dilihat orang lain).
5.  Klik **Create Repository**.

### B. Upload Kode dari Komputer
Buka Terminal di VS Code Anda, lalu jalankan perintah ini satu-per-satu:
```bash
# 1. Pastikan file yang tidak perlu tidak ikut ter-upload
# (Pastikan ada file .gitignore yang mengecualikan node_modules)

# 2. Tambahkan semua file
git add .

# 3. Labeli perubahan ini
git commit -m "Initial commit: Branding & Dashboard Ready"

# 4. Hubungkan ke repository GitHub Anda (GANTI URL DIBAWAH DENGAN PUNYA ANDA)
git remote add origin https://github.com/USERNAME_ANDA/imbalan-kerja-app.git

# 5. Kirim kode ke GitHub
git push -u origin main
```

---

## 2. Membuat Subdomain (Panel Hosting)

Langkah ini biasanya dilakukan di **cPanel** atau **hPanel (Hostinger)**.

### Langkah-langkah:
1.  **Login** ke Dashboard Hosting Anda.
2.  Cari menu **Subdomains**.
3.  Masukkan nama subdomain, misal: `kalkulator` sehingga alamatnya menjadi `kalkulator.domainanda.id`.
4.  Pastikan root directory-nya diarahkan ke folder kosong (misal: `/public_html/kalkulator`).
5.  **SSL**: Pastikan SSL sudah aktif (HTTPS) agar aplikasi aman. Cari menu "Let's Encrypt" atau "AutoSSL" dan klik *Run* untuk subdomain baru tersebut.

---

## 3. Konfigurasi Database (MySQL)

Karena di lokal kita pakai SQLite (file), untuk online wajib pakai MySQL agar data ribuan karyawan tidak lambat.

1.  Buka menu **MySQL Databases** di Panel Hosting.
2.  Buat Database baru: `u123_imbalan`.
3.  Buat User baru: `u123_admin` dan Password.
4.  Tambahkan User ke Database tersebut dengan akses **All Privileges**.
5.  **Catat DATABASE_URL**:
    Formatnya: `mysql://USER:PASSWORD@localhost:3306/NAMA_DATABASE`

---

## 4. Proses Deployment (Vercel - Direkomendasikan)

Untuk aplikasi berbasis **Next.js**, Vercel adalah cara tercepat dan gratis.

1.  Buka [vercel.com](https://vercel.com) dan login via GitHub.
2.  Klik **Add New Project**.
3.  Import repository `imbalan-kerja-app` yang tadi dibuat.
4.  **Environment Variables**: Masukkan variabel ini di Vercel:
    *   `DATABASE_URL`: (Dari langkah 3)
    *   `NEXTAUTH_SECRET`: (Ketik string acak panjang, misal: `jh123891273918273hjsda`)
    *   `AUTH_TRUST_HOST`: `true`
5.  Klik **Deploy**.

### Cek Migration:
Agar tabel database muncul di hosting, jalankan perintah ini di terminal lokal Anda (VS Code) setelah `DATABASE_URL` di `.env` sudah mengarah ke hosting:
```bash
npx prisma db push
```

---

## Ringkasan Struktur Folder Repository
Pastikan folder aplikasi Anda terlihat seperti ini di GitHub:
```text
/APLIKASI
├── .next/ (DIABAIKAN - masuk .gitignore)
├── app/ (Kode utama)
├── components/ (Tampilan/UI)
├── public/ (Foto logo Anda disini)
├── prisma/ (Setting Database)
├── .env (RAHASIA - JANGAN DI-UPLOAD ke GitHub!)
├── package.json
└── tsconfig.json
```

> [!IMPORTANT]
> Jangan pernah mengupload file `.env` ke GitHub (pastikan sudah ada di `.gitignore`). Rahasia database Anda harus dimasukkan manual di menu "Environment Variables" pada Provider Hosting/Vercel.
