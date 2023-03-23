// This is a creation room test
const { Pool } = require("pg");
require("dotenv").config();

// Initialize all variable for the DB connection
describe("PostgreSQL Connection", () => {
  test("Will create picture/player/room, put player in the room and delete all", async () => {
    const Pool = require("pg").Pool;
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    let client = await pool.connect();
    try {
      // create a room with id -1 and name "testname" and password "1234"
      const createRoom = await pool.query(
        `INSERT INTO room (name, password, id)
                 VALUES ($1, $2, $3)`,
        ["testname", "1234", -1]
      );
      // create a image with id -1 and link "testlink" and name "testimg"
      const createPicture = await pool.query(
        `INSERT INTO picture (link, name, id)
                 VALUES ($1, $2, $3)`,
        ["testlink", "testimg", -1]
      );
      // create a player with id -1 and name "testplayer" and room_id -1 and picture_id -1 and email "testemail" and password "testpassword" and bank 1000
      const createPlayer = await pool.query(
        `INSERT INTO player (name, id_picture, email, password, bank, id)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
        ["testplayer", -1, "testemail", "testpassword", 1000, -1]
      );
      // create a player_room with id -1 and player_id -1 and room_id -1
      const createPlayerRoom = await pool.query(
        `INSERT INTO player_room (id_player, id_room, is_host)
                 VALUES ($1, $2, $3)`,
        [-1, -1, true]
      );
      // make leave the player from the player_room
      const leavePlayerFromRoom = await pool.query(
        `DELETE
                 FROM player_room as PR
                 WHERE PR.id_room = $1
                   AND PR.id_player = $2`,
        [-1, -1]
      );
      // delete the room with id -1
      const removeRoom = await pool.query(`DELETE FROM room WHERE id = -1`);

      // delete the player with id -1
      const removePlayer = await pool.query(`DELETE FROM player WHERE id = -1`);
      // delete the image with id -1
      const removePicture = await pool.query(
        `DELETE FROM picture WHERE id = -1`
      );
    } finally {
      // Close the connection
      client.release();
      pool.end();
    }
  });
});
