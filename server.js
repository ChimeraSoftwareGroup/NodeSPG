// Require variable for the server
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const controllers = require("./app/routes/controllers");
const { Server } = require("socket.io");
const handler = require("./app/handler.js");

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// First page of our server route
app.get("/", (request, response) => {
    response.json({ info: "Node.js, Express, and Postgres API" });
});

// Call api
app.get("/games", (req, res) => {
    handler.returnApi(req, res, controllers.getGames);
});
app.get("/games/random", (req, res) => {
    res.status(500).send({ id: 2, name: "test" });
});
app.get("/room/:id/players", (req, res) => {
    handler.returnApi(req, res, controllers.getAllPlayerInRoom);
});
app.post("/room", (req, res) => {
    handler.returnApi(req, res, controllers.addRoom);
});
app.post("/room/join", (req, res) => {
    handler.returnApi(req, res, controllers.joinRoom);
});
app.get("/data/:id/players", (req, res) => {
    handler.returnApi(req, res, controllers.getInfoPlayer);
});
app.post("/data/:id/players", (req, res) => {
    handler.returnApi(req, res, controllers.postInfoPlayer);
});
app.get("/randomGames", (req, res) => {
    handler.returnApi(req, res, controllers.randomGames);
});

//Debug for Unity -- Need improvement
app.post("/room/password", (req, res) => {
    handler.returnApi(req, res, () => {
        return true;
    });
});
app.put("/room/:id", (req, res) => {
    handler.returnApi(req, res, controllers.updateRoom);
});
app.delete("/room/:id", (req, res) => {
    handler.returnApi(req, res, controllers.deleteRoom);
});
app.delete("/room/players/:idPlayer/leave", (req, res) => {
    handler.returnApi(req, res, controllers.leaveRoom);
});

app.delete("/room/players/:idRoom/all", (req, res) => {
    handler.returnApi(req, res, controllers.kickAll);
});

app.get("/socket", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Where the server is running
const server = app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});

const io = new Server(server);

var users = {};

io.on("connection", (socket) => {
    users[socket.id] = { name: socket.id };
    socket.broadcast.emit("player join");
    console.log(`+ a user (${socket.id}) connected`);

    socket.on("disconnect", (e) => {
        results = controllers.leaveRoom({ params: { idPlayer: socket.id } });
        isHost = results.rows[0].is_host;
        idRoomToDelete = results.rows[0].id_room;
        console.log("- user disconnected: " + users[socket.id].name);
        socket.broadcast.emit("player quit", "");
        if (results.rows[0].is_host) {
            controllers.kickAll({ params: { idRoom: idRoomToDelete } });
        }
    });

    socket.on("start game", (data) => {
        console.log("|", users[socket.id].name, ":", data);
        socket.broadcast.emit("start game", data);
    });

    //Check if a player left the room
    //If the player was an host, make everybody leave
    socket.on("quit room", () => {
        controllers.leaveRoom({ params: { idPlayer: socket.id } }, "");
        socket.broadcast.emit("player quit");
        let results = controllers.leaveRoom({
            params: { idPlayer: socket.id },
        });
        let isHost = results.rows[0].is_host;
        let idRoomToDelete = results.rows[0].id_room;
        console.log("- user disconnected: " + users[socket.id].name);
        if (isHost) {
            // console.log("|", users[socket.id].name, ":", user);
            controllers.kickAll({ params: { idRoom: idRoomToDelete } });
            socket.broadcast.emit("delete room");
        }
    });

    //Get all values from socket
    //Get all player in one room with the function
    //Define position
    //Post the information in the DB
    //Send the last data from player 2
    //Return all ending information to the player
    socket.on("ending game", (userScore) => {
        const { nbLifeLeft, nbGamesPlayed } = userScore;
        let listIdPlayer = controllers.getAllOtherPlayerInRoom({
            params: { id_player },
        });
        let position = handler.countNull(listIdPlayer);
        controllers.postInfoPlayer({
            params: { nbLifeLeft, nbGamesPlayed, position },
        });

        if (position > 2) return;

        if (position == 2 && nbLifeLeft == 0) {
            socket.broadcast.emit("send last data");
            return;
        }

        //position == 1
        listIdPlayer = controllers.getAllOtherPlayerInRoom({
            params: { id_player },
        });
        for (let index = 0; index < listIdPlayer.length; index++) {
            const element = listIdPlayer[index];
            io.to(socketId).emit("end game", {
                user_score: {
                    nbGamesPlayed: element.nmb_minigame ?? nbGamesPlayed,
                    nbLifeLeft: element.pv_left ?? nbLifeLeft,
                },
                user_position: element.position ?? position,
                highscore: userScore,
            });
        }
    });
});
