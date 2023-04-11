// Require variable for the server
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const controllers = require("./app/routes/controllers");
const handler = require("./app/handler.js")

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
app.get("/games", (req, res) =>{ handler.returnApi(req,res, controllers.getGames); } );
app.get("/room/:id/players", (req, res) =>{ handler.returnApi(req,res, controllers.getAllPlayerInRoom); } );
app.post("/room", (req, res) =>{ handler.returnApi(req,res, controllers.addRoom); } );
app.post("/room/join", (req, res) =>{ handler.returnApi(req,res, controllers.joinRoom); } );
app.put("/room/:id", (req, res) =>{ handler.returnApi(req,res, controllers.updateRoom); } );
app.delete("/room/:id", (req, res) =>{ handler.returnApi(req,res, controllers.deleteRoom); } );
app.delete("/room/:idRoom/players/:idPlayer/leave", (req, res) =>{ handler.returnApi(req,res, controllers.leaveRoom); } );

// Where the server is running
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
