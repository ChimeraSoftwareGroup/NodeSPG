// Require variable for the server
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const controllers = require("./app/routes/controllers");
const { Server } = require("socket.io");

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
app.get("/games", controllers.getGames);
app.get("/room/:id/players", controllers.getAllPlayerInRoom);
app.post("/room", controllers.addRoom);
app.post("/room/join", controllers.joinRoom);
app.put("/room/:id", controllers.updateRoom);
app.delete("/room/:id", controllers.deleteRoom);
app.delete("/room/:idRoom/players/:idPlayer/leave", controllers.leaveRoom);

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
