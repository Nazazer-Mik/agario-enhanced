import express from "express";
import bodyParser from "body-parser";
import * as db from "./dbconnect";
import http from "http";
import { Server } from "socket.io";
import Game, { UserData } from "./game";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const port = 8800;
const socketPort = 8801;
const game = new Game();

// DB
db.OpenConnection();

// Express REST API

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  const newUser: db.User = req.body;
  const result: string = await db.InsertUser(newUser);

  res.send(result);
});

app.post("/login", async (req, res) => {
  const user: db.User = req.body;
  const result: string = await db.AuthenticateUser(user);
  const userId = await db.GetUserId(user);

  const loginInfo = {
    status: result,
    userId: userId ?? null,
  };

  res.send(JSON.stringify(loginInfo));
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

// Sockets section

io.on("connection", (socket) => {
  socket.on("join", (msg) => {
    const userData: UserData = JSON.parse(msg);
    game.addPlayer(userData);

    console.log(`User ${userData.username} joined game`);
  });

  socket.on("playerMove", (msg) => {
    const details = JSON.parse(msg);
    game
      .findPlayerById(details.userId)
      ?.translate(details.speedX, details.speedY);
  });

  socket.on("leave", (msg) => {
    const userData: UserData = JSON.parse(msg);
    console.log(`User ${userData.username} left game`);
  });
});

server.listen(socketPort, () => {
  console.log(`Socket.io listening on http://localhost:${socketPort}`);
});

// Game Cycle

setInterval(() => {
  game.update();
  const gameData = game.getGeneralMPData();
  io.emit("generalData", JSON.stringify(gameData));
}, 1000 / 120);
