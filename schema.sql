-- =====================================================================
-- SKEMA DATABASE: Sistem Informasi Coworking Space
-- Jalankan seluruh file ini sekali (pgAdmin Query Tool / Neon SQL Editor).
-- PERHATIAN: baris DROP di bawah menghapus tabel lama agar bisa dijalankan ulang.
-- =====================================================================

CREATE SCHEMA IF NOT EXISTS coworkingspace;
SET search_path TO coworkingspace;

DROP TABLE IF EXISTS coworkingspace.pembayaran CASCADE;
DROP TABLE IF EXISTS coworkingspace.jadwal     CASCADE;
DROP TABLE IF EXISTS coworkingspace.reservasi  CASCADE;
DROP TABLE IF EXISTS coworkingspace.ruangan    CASCADE;
DROP TABLE IF EXISTS coworkingspace.pegawai    CASCADE;
DROP TABLE IF EXISTS coworkingspace.pelanggan  CASCADE;

-- ---------- Tabel master ----------
CREATE TABLE coworkingspace.pelanggan (
  pelanggan_id   SERIAL PRIMARY KEY,
  nama_lengkap   VARCHAR(100) NOT NULL,
  email          VARCHAR(100) NOT NULL UNIQUE,
  nomor_telepon  VARCHAR(20),
  alamat         TEXT
);

CREATE TABLE coworkingspace.pegawai (
  pegawai_id     SERIAL PRIMARY KEY,
  nama_pegawai   VARCHAR(100) NOT NULL,
  jabatan        VARCHAR(50),
  email          VARCHAR(100) UNIQUE
);

CREATE TABLE coworkingspace.ruangan (
  ruangan_id      SERIAL PRIMARY KEY,
  nama_ruangan    VARCHAR(100) NOT NULL,
  tipe_ruangan    VARCHAR(50),
  kapasitas       INT NOT NULL CHECK (kapasitas > 0),
  harga_per_jam   NUMERIC(12,2) NOT NULL CHECK (harga_per_jam >= 0),
  status_ruangan  VARCHAR(20) NOT NULL DEFAULT 'Tersedia'
                  CHECK (status_ruangan IN ('Tersedia', 'Perbaikan'))
);

-- ---------- Tabel transaksi ----------
CREATE TABLE coworkingspace.reservasi (
  reservasi_id       SERIAL PRIMARY KEY,
  pelanggan_id       INT NOT NULL REFERENCES coworkingspace.pelanggan(pelanggan_id),
  pegawai_id         INT NOT NULL REFERENCES coworkingspace.pegawai(pegawai_id),
  tanggal_reservasi  DATE NOT NULL DEFAULT CURRENT_DATE,
  status_reservasi   VARCHAR(20) NOT NULL DEFAULT 'Pending'
                     CHECK (status_reservasi IN ('Pending', 'Dikonfirmasi', 'Selesai', 'Dibatalkan'))
);

-- Jadwal ikut terhapus jika reservasinya dihapus (sesuai pesan di aplikasi)
CREATE TABLE coworkingspace.jadwal (
  jadwal_id      SERIAL PRIMARY KEY,
  reservasi_id   INT NOT NULL REFERENCES coworkingspace.reservasi(reservasi_id) ON DELETE CASCADE,
  ruangan_id     INT NOT NULL REFERENCES coworkingspace.ruangan(ruangan_id),
  waktu_mulai    TIMESTAMP NOT NULL,
  waktu_selesai  TIMESTAMP NOT NULL,
  CONSTRAINT chk_waktu CHECK (waktu_selesai > waktu_mulai)
);

-- Reservasi yang sudah punya pembayaran tidak bisa dihapus (sesuai pesan di aplikasi)
CREATE TABLE coworkingspace.pembayaran (
  pembayaran_id       SERIAL PRIMARY KEY,
  reservasi_id        INT NOT NULL REFERENCES coworkingspace.reservasi(reservasi_id),
  metode_pembayaran   VARCHAR(50),
  waktu_bayar         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status_pembayaran   VARCHAR(20) NOT NULL DEFAULT 'Belum Lunas'
                      CHECK (status_pembayaran IN ('Belum Lunas', 'Lunas'))
);

-- ---------- Data contoh ----------
INSERT INTO coworkingspace.pelanggan (nama_lengkap, email, nomor_telepon, alamat) VALUES
 ('Budi Santoso',  'budi@example.com',  '081234567801', 'Jl. Melati No. 12, Jakarta'),
 ('Siti Rahmawati','siti@example.com',  '081234567802', 'Jl. Mawar No. 5, Bandung'),
 ('Andi Pratama',  'andi@example.com',  '081234567803', 'Jl. Kenanga No. 8, Surabaya'),
 ('Dewi Lestari',  'dewi@example.com',  '081234567804', 'Jl. Anggrek No. 21, Yogyakarta');

INSERT INTO coworkingspace.pegawai (nama_pegawai, jabatan, email) VALUES
 ('Rina Wulandari', 'Resepsionis', 'rina@coworking.id'),
 ('Joko Susilo',    'Manajer',     'joko@coworking.id'),
 ('Maya Putri',     'Admin',       'maya@coworking.id');

INSERT INTO coworkingspace.ruangan (nama_ruangan, tipe_ruangan, kapasitas, harga_per_jam, status_ruangan) VALUES
 ('Meeting Room A',  'Meeting Room',   8, 150000, 'Tersedia'),
 ('Meeting Room B',  'Meeting Room',  12, 225000, 'Tersedia'),
 ('Private Office 1','Private Office', 4, 100000, 'Tersedia'),
 ('Hot Desk Area',   'Hot Desk',      20,  35000, 'Tersedia'),
 ('Event Hall',      'Event Space',   50, 500000, 'Perbaikan');

INSERT INTO coworkingspace.reservasi (pelanggan_id, pegawai_id, tanggal_reservasi, status_reservasi) VALUES
 (1, 1, '2026-11-10', 'Selesai'),
 (2, 1, '2026-11-11', 'Dikonfirmasi'),
 (3, 2, '2026-11-12', 'Pending'),
 (4, 3, '2026-11-13', 'Dikonfirmasi');

INSERT INTO coworkingspace.jadwal (reservasi_id, ruangan_id, waktu_mulai, waktu_selesai) VALUES
 (1, 1, '2026-11-10 09:00', '2026-11-10 12:00'),
 (2, 2, '2026-11-14 13:00', '2026-11-14 16:00'),
 (3, 3, '2026-11-15 08:00', '2026-11-15 17:00'),
 (4, 4, '2026-11-16 09:00', '2026-11-16 15:00');

INSERT INTO coworkingspace.pembayaran (reservasi_id, metode_pembayaran, status_pembayaran) VALUES
 (1, 'QRIS',          'Lunas'),
 (2, 'Transfer Bank', 'Belum Lunas');
