// This is a creation room test
const { Pool } = require("pg");
require("dotenv").config();

// Initialize all variable for the DB connection
describe("PostgreSQL Connection", () => {
  test("should connect to PostgreSQL", async () => {
    const Pool = require("pg").Pool;
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    let client;
    try {
      // Will connect to the DB
      client = await pool.connect();
      // The will create a room with defined values
      const res = await client.query(
        `INSERT INTO room (name, password) VALUES ($1, $2)`,
        ["testname", "1234"]
      );
      const remove = await client.query(`
      DELETE FROM room WHERE name = 'testname'`);
    } finally {
      // Close the connection
      client.release();
      pool.end();
    }
  });
});