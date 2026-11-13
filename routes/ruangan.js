const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM coworkingspace.ruangan ORDER BY ruangan_id ASC');
    res.render('ruangan', { data: result.rows, error: req.query.error || null });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/tambah', async (req, res) => {
  const { nama_ruangan, tipe_ruangan, kapasitas, harga_per_jam, status_ruangan } = req.body;
  try {
    await pool.query(
      'INSERT INTO coworkingspace.ruangan (nama_ruangan, tipe_ruangan, kapasitas, harga_per_jam, status_ruangan) VALUES ($1, $2, $3, $4, $5)',
      [nama_ruangan, tipe_ruangan, kapasitas, harga_per_jam, status_ruangan]
    );
    res.redirect('/ruangan');
  } catch (err) {
    res.redirect('/ruangan?error=' + encodeURIComponent(err.message));
  }
});

router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { nama_ruangan, tipe_ruangan, kapasitas, harga_per_jam, status_ruangan } = req.body;
  try {
    await pool.query(
      'UPDATE coworkingspace.ruangan SET nama_ruangan=$1, tipe_ruangan=$2, kapasitas=$3, harga_per_jam=$4, status_ruangan=$5 WHERE ruangan_id=$6',
      [nama_ruangan, tipe_ruangan, kapasitas, harga_per_jam, status_ruangan, id]
    );
    res.redirect('/ruangan');
  } catch (err) {
    res.redirect('/ruangan?error=' + encodeURIComponent(err.message));
  }
});

router.post('/hapus/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM coworkingspace.ruangan WHERE ruangan_id=$1', [req.params.id]);
    res.redirect('/ruangan');
  } catch (err) {
    res.redirect('/ruangan?error=' + encodeURIComponent('Gagal menghapus: Ruangan sedang digunakan di tabel Jadwal.'));
  }
});

module.exports = router;
