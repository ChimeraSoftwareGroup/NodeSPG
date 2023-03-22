// The Express Server
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const controllers = require('./app/routes/controllers')

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get('/games', controllers.getGames);
app.get('/room/:id/players', controllers.getAllPlayerInRoom);
app.post('/room', controllers.addRoom);
app.post('/room/join', controllers.joinRoom);
app.put('/room/:id', controllers.updateRoom);
app.delete('/room/:id', controllers.deleteRoom);
app.delete('/room/:idRoom/players/:idPlayer/leave', controllers.leaveRoom);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
