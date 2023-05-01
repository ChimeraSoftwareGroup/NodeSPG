import * as dotenv from "dotenv";
dotenv.config();

import * as pg from "pg";
const { Pool } = pg.default;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
// Get all games
export function getGamesDB() {
    return pool.query(`SELECT * FROM game`);
}

// Create a room
export function addRoomDB(name, password) {
    return pool.query(
        `INSERT INTO room (name, password) VALUES ($1, $2) RETURNING id`,
        [name, password]
    );
}

// Delete a room
export function deleteRoomDB(id) {
    return pool.query(
        `DELETE FROM room
      WHERE id = $1`,
        [id]
    );
}

// Update the room name
export function updateRoomDB(name, id) {
    return pool.query(`UPDATE room SET name = $1 WHERE id = $2`, [name, id]);
}

// Getting all players in a room
// Defined alias
// Select all players in a specific room
export function getAllPlayerInRoomDB(id) {
    return pool.query(
        `SELECT PL.id, PL.name, PI.link as picture  
        FROM player_room as PR 
        LEFT JOIN player as PL ON PR.id_player = PL.id  
        LEFT JOIN picture as PI ON PL.id_picture = PI.id
        WHERE PR.id_room = $1`,
        [id]
    );
}

// Leaving a room as a player
// Delete the a player in a specific room
export function leaveRoomDB(id_player) {
    return pool.query(
        `DELETE FROM player_room as PR 
        WHERE PR.id_player = $1 RETURNING is_host, id_room`,
        [id_player]
    );
}

// Get a scpecific room by using an existance password
export function getRoomByPassword(password) {
    return pool.query(`SELECT * FROM room as R WHERE R.password = $1`, [
        password,
    ]);
}

// Join a room as a player
// Define if your are the host of the room (first or second one)
export function joinRoomDB(id_player, id_room) {
    return pool.query(
        `INSERT INTO player_room (id_player, id_room, is_host) values
    ($1, $2, (case when exists (select * from player_room WHERE id_room = $3) then false else true end))`,
        [id_player, id_room, id_room]
    );
}

//Make everybody leave the room
export function kickAllDB(id_room) {
    return pool.query(
        `DELETE FROM player_room as PR 
    WHERE PR.id_room = $1`,
        [id_room]
    );
}

// This will get position/pv_left and nmb of minigame
export function getInfoPlayerDB(id_room) {
    return pool.query(
        `DELETE FROM player_room as PR 
  WHERE PR.id_room = $1`,
        [id_room]
    );
}

// This will post position/pv_left and nmb of minigame
export function postInfoPlayerDB(pv_left, nmb_minigame) {
    return pool.query(
        `INSERT INTO player_room (pv_left, nmb_minigame) VALUES ($1, $2) RETURNING id`,
        [pv_left, nmb_minigame]
    );
}

// This will get all players id in the room
export function getAllOtherPlayerInRoomDB(id_player) {
    return pool.query(`SELECT INTO player_room (id_player) VALUES ($1)`, [
        id_player,
    ]);
}
