import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 8800;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

app.post("/register", (req, res) => {
  console.log(req.body);
  res.send("OK");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

// import { MongoClient } from "mongodb";

// const uri = "mongodb://0.0.0.0:27017/";
// const db = "Agario-Enhanced";

// const client = new MongoClient(uri);

// async function wut() {
//   try {
//     // Connect to the MongoDB cluster
//     await client.connect();
//     await console.log("Connected?");

//     const user = {
//       username: "lala",
//       email: "example@gmail.com",
//       password: "password",
//     };

//     await client.db(db).collection("Users").insertOne(user);
//     // Make the appropriate DB calls
//   } finally {
//     // Close the connection to the MongoDB cluster
//     await client.close();
//   }
// }

// wut();
