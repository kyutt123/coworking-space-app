# Sistem Informasi Coworking Space

Aplikasi web CRUD berbasis **Node.js, Express.js, EJS, dan PostgreSQL**.
Modul: Pelanggan, Pegawai, Ruangan, Reservasi, Jadwal, Pembayaran.

## Struktur Database
`schema.sql` membuat schema `coworkingspace` berisi 6 tabel (pelanggan, pegawai, ruangan, reservasi, jadwal, pembayaran) beserta data contoh.

## Menjalankan di Localhost
1. Pasang Node.js (LTS) dan PostgreSQL.
2. Buat database `db_coworking` (pgAdmin: klik kanan Databases > Create > Database).
3. Buka Query Tool pada database tersebut, lalu jalankan seluruh isi `schema.sql`.
4. Salin `.env.example` menjadi `.env`, isi `DB_PASSWORD` dengan password PostgreSQL.
5. Di terminal (folder proyek):
   ```bash
   npm install
   npm run dev
   ```
6. Buka http://localhost:3000

## Deploy ke Vercel
1. Buat database gratis di https://neon.tech, salin *connection string*-nya.
2. Jalankan isi `schema.sql` di SQL Editor Neon.
3. Push proyek ke GitHub (repository public). File `.env` tidak ikut ter-upload (ada di `.gitignore`).
4. Di https://vercel.com: Add New > Project > import repository GitHub.
5. Pada *Environment Variables*, tambahkan `DATABASE_URL` = connection string Neon.
6. Klik Deploy.
