const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const pembayaran = await pool.query(`
      SELECT pb.*, p.nama_lengkap AS nama_pelanggan,
             COALESCE((
               SELECT SUM((EXTRACT(EPOCH FROM (j.waktu_selesai - j.waktu_mulai)) / 3600) * ru.harga_per_jam)
               FROM coworkingspace.jadwal j
               JOIN coworkingspace.ruangan ru ON j.ruangan_id = ru.ruangan_id
               WHERE j.reservasi_id = pb.reservasi_id
             ), 0) AS total_tagihan
      FROM coworkingspace.pembayaran pb
      JOIN coworkingspace.reservasi r ON pb.reservasi_id = r.reservasi_id
      JOIN coworkingspace.pelanggan p ON r.pelanggan_id = p.pelanggan_id
      ORDER BY pb.pembayaran_id DESC
    `);

    const reservasiBelumBayar = await pool.query(`
      SELECT r.reservasi_id, p.nama_lengkap, r.tanggal_reservasi
      FROM coworkingspace.reservasi r
      JOIN coworkingspace.pelanggan p ON r.pelanggan_id = p.pelanggan_id
      WHERE r.reservasi_id NOT IN (SELECT reservasi_id FROM coworkingspace.pembayaran)
      ORDER BY r.reservasi_id DESC
    `);

    res.render('pembayaran', {
      data: pembayaran.rows,
      reservasiList: reservasiBelumBayar.rows,
      error: req.query.error || null,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/tambah', async (req, res) => {
  const { reservasi_id, metode_pembayaran, status_pembayaran } = req.body;
  try {
    await pool.query(
      'INSERT INTO coworkingspace.pembayaran (reservasi_id, metode_pembayaran, status_pembayaran) VALUES ($1, $2, $3)',
      [reservasi_id, metode_pembayaran, status_pembayaran]
    );
    res.redirect('/pembayaran');
  } catch (err) {
    res.redirect('/pembayaran?error=' + encodeURIComponent(err.message));
  }
});

router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { metode_pembayaran, status_pembayaran } = req.body;
  try {
    await pool.query(
      'UPDATE coworkingspace.pembayaran SET metode_pembayaran=$1, status_pembayaran=$2, waktu_bayar=CURRENT_TIMESTAMP WHERE pembayaran_id=$3',
      [metode_pembayaran, status_pembayaran, id]
    );
    res.redirect('/pembayaran');
  } catch (err) {
    res.redirect('/pembayaran?error=' + encodeURIComponent(err.message));
  }
});

router.post('/hapus/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM coworkingspace.pembayaran WHERE pembayaran_id=$1', [req.params.id]);
    res.redirect('/pembayaran');
  } catch (err) {
    res.redirect('/pembayaran?error=' + encodeURIComponent(err.message));
  }
});

module.exports = router;
