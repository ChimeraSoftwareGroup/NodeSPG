// Require variable for the server
import express from "express";
import {
    onDisconnected,
    startGame,
    initJoin,
    endingGame,
} from "./handler/socket.js";
import gameRoutes from "./routes/games.js";
import roomRoutes from "./routes/rooms.js";
import bodyParser from "body-parser";
import {
    leaveRoom,
    kickAll,
    postInfoPlayer,
    getAllOtherPlayerInRoom,
} from "./controller/controllers.js";
const app = express();
const port = 3000;
import { Server } from "socket.io";
import { deleteRoomDB, joinRoomDB } from "./handler/queries.js";

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// Where the server is running
const server = app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});

// First page of our server route
app.get("/", (request, response) => {
    response.json({ info: "Node.js, Express, and Postgres API" });
});

// Call api
app.use("/games", gameRoutes);
app.use("/rooms", roomRoutes);

app.get("/socket", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const io = new Server(server);

var users = {};

io.on("connection", (socket) => {
    users[socket.id] = { name: socket.id };
    console.log(`+ a user (${socket.id}) connected`);

    socket.on("disconnect", async (e) => {
        onDisconnected(socket);
    });

    socket.on("init join", (id_room) => {
        initJoin(socket, id_room);
    });

    socket.on("start game", (data) => {
        startGame(socket, data);
    });

    //Check if a player left the room
    //If the player was an host, make everybody leave
    socket.on("quit room", () => socket.disconnect(true));

    //Get all values from socket
    //Get all player in one room with the function
    //Define position
    //Post the information in the DB
    //Send the last data from player 2
    //Return all ending information to the player
    socket.on("ending game", (userScore) => {
        endingGame(socket, userScore);
    });
});

export default app;
