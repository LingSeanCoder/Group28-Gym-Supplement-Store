const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Bắt buộc khi dùng Supabase trên production/local
  }
});

// Test kết nối
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('✅ Connected to Supabase PostgreSQL successfully');
  release();
});

module.exports = pool;