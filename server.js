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

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });
});
