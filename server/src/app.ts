import express from "express";
import bodyParser from "body-parser";
import * as db from "./dbconnect";

const app = express();
const port = 8800;

db.OpenConnection();

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
