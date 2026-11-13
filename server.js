const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', require('./routes/index'));
app.use('/pelanggan', require('./routes/pelanggan'));
app.use('/pegawai', require('./routes/pegawai'));
app.use('/ruangan', require('./routes/ruangan'));
app.use('/reservasi', require('./routes/reservasi'));
app.use('/jadwal', require('./routes/jadwal'));
app.use('/pembayaran', require('./routes/pembayaran'));

// Di Vercel, aplikasi diekspor (tanpa listen). Di komputer lokal, server dijalankan.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
