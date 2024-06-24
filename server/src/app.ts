import express from "express";
import bodyParser from "body-parser";
import * as db from "./dbconnect";
import http from "http";
import { Server } from "socket.io";
import Game from "./game";

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
  console.log("User connected by socket(?)");

  socket.on("playerUpdate", (msg) => {
    console.log("PLayer is idiot: " + msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
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
