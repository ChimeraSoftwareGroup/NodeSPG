const { createPassword } = require("../handler");
const db = require("../queries");
require("../handler");

// Return all games
async function getGames(request, response) {
  results = await db.getGamesDB();
  response.status(200).json(results.rows);
}

// Return The added rooms's id
async function addRoom(request, response) {
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
  response.status(200).json(results.rows);
}

// Will delete a room by id
async function deleteRoom(request, response) {
  const id = parseInt(request.params.id);
  results = await db.deleteRoomDB(id);
  response.status(200).send(`Room deleted with ID: ${id}`);
}

// Return the modified rooms'id
async function updateRoom(request, response) {
  const id = parseInt(request.params.id);
  const { name } = request.body;
  results = await db.updateRoomDB(name, id);
  response.status(200).send(`Room modified with ID: ${id}`);
}

// Return all players in a room
async function getAllPlayerInRoom(request, response) {
  const { id } = request.params.id;
  results = await db.getAllPlayerInRoomDB(id);
  response.status(200).send(results);
}

// Will deleted a player of a room
async function leaveRoom(request, response) {
  const { idPlayer, idRoom } = request.params;
  results = await db.leaveRoomDB(idPlayer, idRoom);
  response.status(200).json(results);
}

// Will join an exesting room, and define the host
async function joinRoom(request, response) {
  const { id_player, password } = request.body;
  dataRoom = await db.getRoomByPassword(password);
  if (dataRoom.rows.length != 0) {
    results = await db.joinRoomDB(id_player, dataRoom.rows[0].id);
    response.status(200).json(results);
  } else {
    response.status(404).json({ error: "room doesn't exist" });
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
