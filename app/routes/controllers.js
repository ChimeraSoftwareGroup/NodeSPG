const { createPassword } = require('../handler');
const db = require('../queries');
require('../handler');

async function getGames(request, response) {
    results = await db.getGamesDB()
    response.status(200).json(results.rows);
}

async function addRoom(request, response) {
    password = ""
    room = ["azerty"]
    while (room != []) {
        password =  createPassword();
        room = db.getRoomByPassword(password)
    } 
    const { name } = request.body;
    results = await db.addRoomDB(name,password)  
    response.status(201).send(`Room added with name: ${name}`);
}

async function deleteRoom(request, response) {
    const id = parseInt(request.params.id);
    results = await db.deleteRoomDB(id)  
    response.status(200).send(`Room deleted with ID: ${id}`);
}

async function updateRoom(request, response) {
    const id = parseInt(request.params.id);
    const { name } = request.body;
    results = await db.updateRoomDB(name,id)
    response.status(200).send(`Room modified with ID: ${id}`);
}

async function getAllPlayerInRoom(request, response) {
    const { id } = request.params.id;
    results = await db.getAllPlayerInRoomDB(id)
    response.status(200).send(results);
}

async function leaveRoom(request, response) {
    const { idPlayer, idRoom } = request.params;
    results = await db.leaveRoomDB(idPlayer,idRoom)
    response.status(200).json(results);
}

async function joinRoom(request, response) {
    const { id_player, password } = request.body;
    dataRoom = await db.getRoomByPassword(password);
    console.log(dataRoom.rows, password, id_player, request.body)
    if(dataRoom.rows.length != 0){
        results = await db.joinRoomDB(id_player, dataRoom.rows[0].id);
        response.status(200).json(results);
    } else{
        response.status(404).json({"error":"room doesn't exist"})
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
  