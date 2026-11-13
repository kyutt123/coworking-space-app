const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const pelangganCount = await pool.query('SELECT COUNT(*) FROM coworkingspace.pelanggan');
    const ruanganCount = await pool.query('SELECT COUNT(*) FROM coworkingspace.ruangan');
    const reservasiCount = await pool.query('SELECT COUNT(*) FROM coworkingspace.reservasi');
    const jadwalCount = await pool.query('SELECT COUNT(*) FROM coworkingspace.jadwal');

    res.render('index', {
      stats: {
        pelanggan: pelangganCount.rows[0].count,
        ruangan: ruanganCount.rows[0].count,
        reservasi: reservasiCount.rows[0].count,
        jadwal: jadwalCount.rows[0].count,
      },
    });
  } catch (err) {
    res.status(500).send('Database Error: ' + err.message);
  }
});

module.exports = router;
