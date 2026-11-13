const { Pool, types } = require('pg');
require('dotenv').config();

// Kolom DATE dikembalikan sebagai teks "YYYY-MM-DD" (bukan objek Date),
// supaya tanggal tidak mundur satu hari akibat konversi zona waktu.
types.setTypeParser(1082, (value) => value);

// Jika DATABASE_URL ada (Vercel / Neon / Supabase) -> pakai database cloud (SSL).
// Jika tidak ada -> pakai PostgreSQL lokal dari variabel DB_* di .env.
const config = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 3,
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    };

const pool = new Pool(config);

pool.on('connect', (client) => {
  client.query('SET search_path TO coworkingspace').catch(() => {});
});

module.exports = pool;
