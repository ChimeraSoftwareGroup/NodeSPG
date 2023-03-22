const { Pool } = require('pg');
require("dotenv").config();

describe('PostgreSQL Connection', () => {
  test('should connect to PostgreSQL', async () => {
    const Pool = require("pg").Pool;
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: 5432,
    });
    
    let client;
    try {
      client = await pool.connect();
      const res = await client.query( `INSERT INTO room (name, password) VALUES ($1, $2)`,
      ["testname", "1234"]);
    } finally {
      client.release();
      pool.end();
    }
  });
});
