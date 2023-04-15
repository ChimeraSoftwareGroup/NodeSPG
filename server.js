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
app.put("/room/:id", (req, res) => {
    handler.returnApi(req, res, controllers.updateRoom);
});
app.delete("/room/:id", (req, res) => {
    handler.returnApi(req, res, controllers.deleteRoom);
});
app.delete("/room/:idRoom/players/:idPlayer/leave", (req, res) => {
    handler.returnApi(req, res, controllers.leaveRoom);
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
    users[socket.id] = "";

    console.log(`+ a user (${socket.id}) connected`);

    socket.on("disconnect", (e) => {
        console.log("- user disconnected: " + users[socket.id]);
        io.emit("user leave", users[socket.id]);
    });

    //Will be received right after the connection, the init the username who just join
    socket.on("initName", (user) => {
        users[socket.id] = user.name;
        console.log("| Define as", users[socket.id]);
        io.emit("user join", users[socket.id]);
    });

    socket.on("start game", (msg) => {
        io.emit("start game", msg);
    });
});
