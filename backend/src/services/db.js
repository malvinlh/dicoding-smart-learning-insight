const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.PGHOST || 'localhost',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || '',
        database: process.env.PGDATABASE || 'learning_insights_db',
        port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
        ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
      }
);

module.exports = pool;
