import { createPassword, countGames } from "../handler/handler.js";
import {
    getGamesDB,
    addRoomDB,
    deleteRoomDB,
    updateRoomDB,
    getAllPlayerInRoomDB,
    joinRoomDB,
    leaveRoomDB,
    kickAllDB,
    getInfoPlayerDB,
    postInfoPlayerDB,
    getAllPlayerInRoomDB,
    getRoomByPasswordDB,
} from "../handler/queries.js";

// Return all games
export async function getGames(request) {
    const results = await getGamesDB();
    return results.rows;
}

// Return The added rooms's id
export async function addRoom(request) {
    let password = "";
    let length = -1;
    //check if another room's password exist
    while (length != 0) {
        // Will call the function to create a random password
        password = createPassword();
        let room = await getRoomByPasswordDB(password);
        length = room.rows.length;
    }
    // Will create the room
    const { name, minIDGame, maxIDGame, nbGame } = request.body;
    const randomGames = countGames(minIDGame, maxIDGame, nbGame);
    const results = await addRoomDB(name, password);
    return { room: { rows: results.rows, rowCount: results.rowCount }, gameList: randomGames };
}

// Will delete a room by id
export async function deleteRoom(request) {
    const { id } = request.params;
    const results = await deleteRoomDB(parseInt(id));
    return results.rowCount;
}

export async function getRoomByPassword(request) {
    const { password } = request.body;
    const results = await getRoomByPasswordDB(password);
    if (results.rows.length == 0) throw new Exception("No Room was found");
    return results.rows[0];
}

// Return the modified rooms'id
export async function updateRoom(request) {
    const { id } = request.params;
    const { name } = request.body;
    const results = await updateRoomDB(name, parseInt(id));
    return results;
}

// Return all players in a room
export async function getAllPlayerInRoom(request) {
    const { id } = request.params;
    const results = await getAllPlayerInRoomDB(id);
    return results;
}

// Will deleted a player of a room
export async function leaveRoom(request) {
    const { idPlayer } = request.params;
    const results = await leaveRoomDB(idPlayer);
    return results;
}

// Will join an exesting room, and define the host
export async function joinRoom(request) {
    const { id_player, password } = request.body;
    const dataRoom = await getRoomByPasswordDB(password);
    if (dataRoom.rows.length != 0) {
        const results = await joinRoomDB(id_player, dataRoom.rows[0].id);
        return results;
    } else {
        return Error;
    }
}
// Will deleted all player of a room
export async function kickAll(request) {
    const { idRoom } = request.params;
    const results = await kickAllDB(idRoom);
    return results;
}

// This will get position/pv_left and nmb of minigame
export async function getInfoPlayer(request) {
    const { idRoom } = request.params;
    const results = await getInfoPlayerDB(idRoom);
    return results;
}

// This will post position/pv_left and nmb of minigame
export async function postInfoPlayer(request) {
    const { pv_left, nmb_minigame } = request.body;
    const results = await postInfoPlayerDB(pv_left, nmb_minigame);
    return results;
}

// This will get all players id in the room
export async function getAllOtherPlayerInRoom(request) {
    const { id_player } = request.params;
    const results = await getAllPlayerInRoomDB(id_player);
    return results;
}

// This will get all players id in the room
export async function randomGames(request) {
    const { id_player } = request.params;
    const results = await randomGamesDB(id_player);
    return results;
}
