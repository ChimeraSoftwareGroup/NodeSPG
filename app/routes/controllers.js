const { createPassword, countGames } = require("../handler");
const db = require("../queries");
require("../handler");

// Return all games
async function getGames(request) {
    results = await db.getGamesDB();
    return results.rows;
}

// Return The added rooms's id
async function addRoom(request) {
    let password = "";
    let length = -1;
    //check if another room's password exist
    while (length != 0) {
        // Will call the function to create a random password
        password = createPassword();
        let room = await db.getRoomByPassword(password);
        length = room.rows.length;
    }
    // Will create the room
    const { name, minIDGame, manIDGame, nbGame } = request.body;
    const randomGames = countGames(minIDGame, manIDGame, nbGame);
    const results = await db.addRoomDB(name, password);
    return { room: results, gameList: randomGames };
}

// Will delete a room by id
async function deleteRoom(request) {
    const id = parseInt(request.params.id);
    results = await db.deleteRoomDB(id);
    return results.rowCount;
}

// Return the modified rooms'id
async function updateRoom(request) {
    const id = parseInt(request.params.id);
    const { name } = request.body;
    results = await db.updateRoomDB(name, id);
    return results;
}

// Return all players in a room
async function getAllPlayerInRoom(request) {
    const { id } = request.params.id;
    results = await db.getAllPlayerInRoomDB(id);
    return results;
}

// Will deleted a player of a room
async function leaveRoom(request) {
    const { idPlayer } = request.params;
    results = await db.leaveRoomDB(idPlayer);
    return results;
}

// Will join an exesting room, and define the host
async function joinRoom(request) {
    const { id_player, password } = request.body;
    dataRoom = await db.getRoomByPassword(password);
    if (dataRoom.rows.length != 0) {
        results = await db.joinRoomDB(id_player, dataRoom.rows[0].id);
        return results;
    } else {
        return Error;
    }
}
// Will deleted all player of a room
async function kickAll(request) {
    const { idRoom } = request.params;
    results = await db.kickAllDB(idRoom);
    return results;
}

// This will get position/pv_left and nmb of minigame
async function getInfoPlayer(request) {
    const { idRoom } = request.params;
    results = await db.getInfoPlayerDB(idRoom);
    return results;
}

// This will post position/pv_left and nmb of minigame
async function postInfoPlayer(request) {
    const { pv_left, nmb_minigame } = request.body;
    results = await db.postInfoPlayerDB(pv_left, nmb_minigame);
    return results;
}

// This will get all players id in the room
async function getAllOtherPlayerInRoom(request) {
    const { id_player } = request.params;
    results = await db.getAllOtherPlayerInRoomDB(id_player);
    return results;
}

// This will get all players id in the room
async function randomGames(request) {
    const { id_player } = request.params;
    results = await db.randomGamesDB(id_player);
    return results;
}

module.exports = {
    getGames,
    addRoom,
    deleteRoom,
    updateRoom,
    getAllPlayerInRoom,
    joinRoom,
    leaveRoom,
    kickAll,
    getInfoPlayer,
    postInfoPlayer,
    getAllOtherPlayerInRoom,
    randomGames,
};
