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
        `INSERT INTO room (name, password) VALUES ($1, $2) RETURNING id, password`,
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

// Leaving a room as a player
// Delete the a player in a specific room
export function leaveRoomDB(id_player) {
    return pool.query(
        `DELETE FROM player_room as PR 
        WHERE PR.id_player = $1 RETURNING is_host, id_room`,
        [id_player]
    );
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
export function getAllPlayerInRoomDB(id_player) {
    return pool.query(
        `SELECT * FROM player_room 
        WHERE id_room IN (
            SELECT id_room FROM player_room WHERE id_player = $2
        )`,
        [id_player]
    );
}

export function getRoomByPasswordDB(password) {
    return pool.query(`SELECT * FROM room WHERE password = $1`, [password]);
}
