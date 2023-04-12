require("dotenv").config();

// Initialize all variable for the DB connection
const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Get all games
const getGamesDB = () => {
  return pool.query(`SELECT * FROM game`);
};

// Create a room
const addRoomDB = (name, password) => {
  return pool.query(`INSERT INTO room (name, password) VALUES ($1, $2) RETURNING id`, [
    name,
    password,
  ]);
};

// Delete a room
const deleteRoomDB = (id) => {
  return pool.query(
    `DELETE FROM room
      WHERE id = $1`,
    [id]
  );
};

// Update the room name
const updateRoomDB = (name, id) => {
  return pool.query(`UPDATE room SET name = $1 WHERE id = $2`, [name, id]);
};

// Getting all players in a room
// Defined alias
// Select all players in a specific room
const getAllPlayerInRoomDB = (id) => {
  return pool.query(
    `SELECT PL.id, PL.name, PI.link as picture  
        FROM player_room as PR 
        LEFT JOIN player as PL ON PR.id_player = PL.id  
        LEFT JOIN picture as PI ON PL.id_picture = PI.id
        WHERE PR.id_room = $1`,
    [id]
  );
};

// Leaving a room as a player
// Delete the a player in a specific room
const leaveRoomDB = (id_room, id_player) => {
  return pool.query(
    `DELETE FROM player_room as PR 
        WHERE PR.id_room = $1 AND PR.id_player = $2`,
    [id_room, id_player]
  );
};

// Get a scpecific room by using an existance password
const getRoomByPassword = (password) => {
  return pool.query(`SELECT * FROM room as R WHERE R.password = $1`, [
    password,
  ]);
};

// Join a room as a player
// Define if your are the host of the room (first or second one)
const joinRoomDB = (id_player, id_room) => {
  return pool.query(
    `INSERT INTO player_room (id_player, id_room, is_host) values
    ($1, $2, (case when exists (select * from player_room) then false else true end))`,
    [id_player, id_room]
  );
};

// Export result request
module.exports = {
  getGamesDB,
  addRoomDB,
  deleteRoomDB,
  updateRoomDB,
  getAllPlayerInRoomDB,
  joinRoomDB,
  getRoomByPassword,
  leaveRoomDB,
};
