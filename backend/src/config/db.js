require('./env');
const { Pool } = require('pg');

// DATABASE_URL takes precedence; otherwise pg reads the standard PG* variables.
// Connections are opened lazily, so the API health endpoint needs no database.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  application_name: 'gym-supplement-store',
});

pool.on('error', () => {
  console.error('Unexpected error on an idle PostgreSQL connection.');
});

module.exports = pool;
