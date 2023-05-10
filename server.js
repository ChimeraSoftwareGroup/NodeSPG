// Require variable for the server
import express from "express";
import SocketManager from "./app/handler/socket.js";
import gameRoutes from "./app/routes/games.js";
import roomRoutes from "./app/routes/rooms.js";
import bodyParser from "body-parser";
const app = express();
const port = process.env.PORT || 3000;
import { Server } from "socket.io";

//#region define __dirname
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//#endregion

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
    res.sendFile(__dirname + "/app/index.html");
});

const io = new Server(server);

var users = {};

io.on("connection", (socket) => {
    const socketManager = new SocketManager(socket, io);
    users[socket.id] = { name: socket.id };
    console.log(`+ a user (${socket.id}) connected`);

    try {
        socket.on("disconnect", () => socketManager.onDisconnected());

        socket.on("init join", (id_room) => socketManager.initJoin(id_room));

        socket.on("start game", (data) => socketManager.onStartGame(data));

        //Check if a player left the room
        //If the player was an host, make everybody leave
        socket.on("quit room", () => socket.disconnect(true));

        //Get all values from socket
        //Get all player in one room with the function
        //Define position
        //Post the information in the DB
        //Send the last data from player 2
        //Return all ending information to the player
        socket.on("ending game", (userScore) => socketManager.endingGame(userScore));
    } catch (error) {
        io.to(socket.id).emit("socket error", error);
    }
});

export default app;
