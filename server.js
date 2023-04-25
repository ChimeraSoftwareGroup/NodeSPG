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
    io.emit("player join", "");
    console.log(`+ a user (${socket.id}) connected`);

    socket.on("disconnect", (e) => {
        results = controllers.leaveRoom({params:{idPlayer: socket.id}})
        isHost = results.rows[0].is_host;
        idRoomToDelete = results.rows[0].id_room;
        console.log("- user disconnected: " + users[socket.id].name);
        io.emit("player quit", "");
        if(results.rows[0].is_host){
            controllers.kickAll({params:{idRoom: idRoomToDelete}})
        }
    });

    //Will be received right after the connection, the init the username who just join
    //--Not used in Unity
    socket.on("initName", (user) => {
        users[socket.id].name = user.name;
        console.log("| Define as", users[socket.id]);
        io.emit("user join", users[socket.id]);
    });

    socket.on("start game", (data) => {
        console.log("|", users[socket.id].name, ":", data);
        io.emit("start game", data);
    });

    socket.on("quit room", (user) => {
        controllers.leaveRoom({params:{idPlayer: socket.id}}, "")
        io.emit("player quit", "");
        results = controllers.leaveRoom({params:{idPlayer: socket.id}})
        isHost = results.rows[0].is_host;
        idRoomToDelete = results.rows[0].id_room;
        console.log("- user disconnected: " + users[socket.id].name);
        if(results.rows[0].is_host){
            console.log("|", users[socket.id].name, ":", user);
            controllers.kickAll({params:{idRoom: idRoomToDelete}})
            io.emit("quit room", user);
        }
    });

    socket.on("ending game", (user) => {

        
        // stocker les valeur pv/nmb de mini jeu (soitr new tables ou deja dans player)
        // récuperer le score du user et les mettre en DB
        // si (l'avant dernier joueur (length) && nmb total de vie que le joueur a = 0) || (joueur actuel est le dernier)
        //      for(user id on lui donne son score personnel)
                // io.emit("end game", user);
        // else = nothing
        // 
        console.log("|", users[socket.id].name, ":", user);
        io.emit("ending game", user);
    });
});
