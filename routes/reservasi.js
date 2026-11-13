const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const reservasi = await pool.query(`
      SELECT r.*, p.nama_lengkap AS nama_pelanggan, pg.nama_pegawai
      FROM coworkingspace.reservasi r
      JOIN coworkingspace.pelanggan p ON r.pelanggan_id = p.pelanggan_id
      JOIN coworkingspace.pegawai pg ON r.pegawai_id = pg.pegawai_id
      ORDER BY r.reservasi_id DESC
    `);
    const pelanggan = await pool.query('SELECT pelanggan_id, nama_lengkap FROM coworkingspace.pelanggan ORDER BY nama_lengkap');
    const pegawai = await pool.query('SELECT pegawai_id, nama_pegawai FROM coworkingspace.pegawai ORDER BY nama_pegawai');

    res.render('reservasi', {
      data: reservasi.rows,
      pelangganList: pelanggan.rows,
      pegawaiList: pegawai.rows,
      error: req.query.error || null,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/tambah', async (req, res) => {
  const { pelanggan_id, pegawai_id, tanggal_reservasi, status_reservasi } = req.body;
  try {
    await pool.query(
      'INSERT INTO coworkingspace.reservasi (pelanggan_id, pegawai_id, tanggal_reservasi, status_reservasi) VALUES ($1, $2, $3, $4)',
      [pelanggan_id, pegawai_id, tanggal_reservasi || new Date(), status_reservasi]
    );
    res.redirect('/reservasi');
  } catch (err) {
    res.redirect('/reservasi?error=' + encodeURIComponent(err.message));
  }
});

router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { pelanggan_id, pegawai_id, tanggal_reservasi, status_reservasi } = req.body;
  try {
    await pool.query(
      'UPDATE coworkingspace.reservasi SET pelanggan_id=$1, pegawai_id=$2, tanggal_reservasi=$3, status_reservasi=$4 WHERE reservasi_id=$5',
      [pelanggan_id, pegawai_id, tanggal_reservasi, status_reservasi, id]
    );
    res.redirect('/reservasi');
  } catch (err) {
    res.redirect('/reservasi?error=' + encodeURIComponent(err.message));
  }
});

router.post('/hapus/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM coworkingspace.reservasi WHERE reservasi_id=$1', [req.params.id]);
    res.redirect('/reservasi');
  } catch (err) {
    res.redirect('/reservasi?error=' + encodeURIComponent('Gagal menghapus: Reservasi sudah memiliki data Pembayaran.'));
  }
});

module.exports = router;
