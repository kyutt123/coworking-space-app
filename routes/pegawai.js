const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM coworkingspace.pegawai ORDER BY pegawai_id ASC');
    res.render('pegawai', { data: result.rows, error: req.query.error || null });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/tambah', async (req, res) => {
  const { nama_pegawai, jabatan, email } = req.body;
  try {
    await pool.query(
      'INSERT INTO coworkingspace.pegawai (nama_pegawai, jabatan, email) VALUES ($1, $2, $3)',
      [nama_pegawai, jabatan, email || null]
    );
    res.redirect('/pegawai');
  } catch (err) {
    res.redirect('/pegawai?error=' + encodeURIComponent(err.message));
  }
});

router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { nama_pegawai, jabatan, email } = req.body;
  try {
    await pool.query(
      'UPDATE coworkingspace.pegawai SET nama_pegawai=$1, jabatan=$2, email=$3 WHERE pegawai_id=$4',
      [nama_pegawai, jabatan, email || null, id]
    );
    res.redirect('/pegawai');
  } catch (err) {
    res.redirect('/pegawai?error=' + encodeURIComponent(err.message));
  }
});

router.post('/hapus/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM coworkingspace.pegawai WHERE pegawai_id=$1', [req.params.id]);
    res.redirect('/pegawai');
  } catch (err) {
    res.redirect('/pegawai?error=' + encodeURIComponent('Gagal menghapus: Pegawai masih tercatat pada Reservasi.'));
  }
});

module.exports = router;
