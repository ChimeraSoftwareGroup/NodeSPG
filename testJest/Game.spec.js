// This test wil add game and check the table game
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
      // The will add a game
      const insertGame = await client.query(
        `
      INSERT INTO game (name) VALUES ($1)`,
        ["cyberpunk"]
      );
      const checkGame = await client.query(`
      SELECT name FROM game WHERE name = 'cyberpunk'`);
      expect((checkGame.name = "cyberpunk"));
      const removeGame = await client.query(`
      DELETE FROM game WHERE name = 'cyberpunk'`);
    } finally {
      // Close the connection
      client.release();
      pool.end();
    }
  });
});
