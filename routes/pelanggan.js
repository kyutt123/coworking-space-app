const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM coworkingspace.pelanggan ORDER BY pelanggan_id ASC');
    res.render('pelanggan', { data: result.rows, error: req.query.error || null });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/tambah', async (req, res) => {
  const { nama_lengkap, email, nomor_telepon, alamat } = req.body;
  try {
    await pool.query(
      'INSERT INTO coworkingspace.pelanggan (nama_lengkap, email, nomor_telepon, alamat) VALUES ($1, $2, $3, $4)',
      [nama_lengkap, email, nomor_telepon, alamat]
    );
    res.redirect('/pelanggan');
  } catch (err) {
    res.redirect('/pelanggan?error=' + encodeURIComponent(err.message));
  }
});

router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { nama_lengkap, email, nomor_telepon, alamat } = req.body;
  try {
    await pool.query(
      'UPDATE coworkingspace.pelanggan SET nama_lengkap=$1, email=$2, nomor_telepon=$3, alamat=$4 WHERE pelanggan_id=$5',
      [nama_lengkap, email, nomor_telepon, alamat, id]
    );
    res.redirect('/pelanggan');
  } catch (err) {
    res.redirect('/pelanggan?error=' + encodeURIComponent(err.message));
  }
});

router.post('/hapus/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM coworkingspace.pelanggan WHERE pelanggan_id=$1', [req.params.id]);
    res.redirect('/pelanggan');
  } catch (err) {
    res.redirect('/pelanggan?error=' + encodeURIComponent('Gagal menghapus: Data masih dipakai di tabel Reservasi.'));
  }
});

module.exports = router;
