const { createPassword } = require("../handler");
const db = require("../queries");
require("../handler");

// Return all games
async function getGames(request) {
  results = await db.getGamesDB();
  return results.rows;
}

// Return The added rooms's id
async function addRoom(request, isTest = false) {
  password = "";
  length = -1;
  //check if another room's password exist
  while (length != 0) {
    // Will call the function to create a random password
    password = createPassword();
    room = await db.getRoomByPassword(password);
    length = room.rows.length;
  }
  // Will create the room
  const { name } = request.body;
  results = await db.addRoomDB(name, password);
  return isTest ? results : results.rowCount;
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
  const { idPlayer, idRoom } = request.params;
  results = await db.leaveRoomDB(idPlayer, idRoom);
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
    return Error ;
  }
}

module.exports = {
  getGames,
  addRoom,
  deleteRoom,
  updateRoom,
  getAllPlayerInRoom,
  joinRoom,
  leaveRoom,
};
