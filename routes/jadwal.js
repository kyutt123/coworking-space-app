const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const jadwal = await pool.query(`
      SELECT j.*, r.status_reservasi, p.nama_lengkap AS nama_pelanggan,
             ru.nama_ruangan, ru.harga_per_jam,
             ROUND((EXTRACT(EPOCH FROM (j.waktu_selesai - j.waktu_mulai)) / 3600)::numeric, 2) AS durasi_jam
      FROM coworkingspace.jadwal j
      JOIN coworkingspace.reservasi r ON j.reservasi_id = r.reservasi_id
      JOIN coworkingspace.pelanggan p ON r.pelanggan_id = p.pelanggan_id
      JOIN coworkingspace.ruangan ru ON j.ruangan_id = ru.ruangan_id
      ORDER BY j.waktu_mulai DESC
    `);
    const reservasi = await pool.query(`
      SELECT r.reservasi_id, p.nama_lengkap, r.tanggal_reservasi
      FROM coworkingspace.reservasi r
      JOIN coworkingspace.pelanggan p ON r.pelanggan_id = p.pelanggan_id
      ORDER BY r.reservasi_id DESC
    `);
    const ruangan = await pool.query("SELECT * FROM coworkingspace.ruangan WHERE status_ruangan = 'Tersedia' ORDER BY nama_ruangan");

    res.render('jadwal', {
      data: jadwal.rows,
      reservasiList: reservasi.rows,
      ruanganList: ruangan.rows,
      error: req.query.error || null,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/tambah', async (req, res) => {
  const { reservasi_id, ruangan_id, waktu_mulai, waktu_selesai } = req.body;
  try {
    await pool.query(
      'INSERT INTO coworkingspace.jadwal (reservasi_id, ruangan_id, waktu_mulai, waktu_selesai) VALUES ($1, $2, $3, $4)',
      [reservasi_id, ruangan_id, waktu_mulai, waktu_selesai]
    );
    res.redirect('/jadwal');
  } catch (err) {
    res.redirect('/jadwal?error=' + encodeURIComponent(err.message));
  }
});

router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { reservasi_id, ruangan_id, waktu_mulai, waktu_selesai } = req.body;
  try {
    await pool.query(
      'UPDATE coworkingspace.jadwal SET reservasi_id=$1, ruangan_id=$2, waktu_mulai=$3, waktu_selesai=$4 WHERE jadwal_id=$5',
      [reservasi_id, ruangan_id, waktu_mulai, waktu_selesai, id]
    );
    res.redirect('/jadwal');
  } catch (err) {
    res.redirect('/jadwal?error=' + encodeURIComponent(err.message));
  }
});

router.post('/hapus/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM coworkingspace.jadwal WHERE jadwal_id=$1', [req.params.id]);
    res.redirect('/jadwal');
  } catch (err) {
    res.redirect('/jadwal?error=' + encodeURIComponent(err.message));
  }
});

module.exports = router;
