import { MongoClient } from "mongodb";

export interface User {
  email: string;
  username: string;
  password: string;
}

const uri = "mongodb://0.0.0.0:27017/";
const dbName = "Agario-Enhanced";
const client = new MongoClient(uri);

export function OpenConnection() {
  client.connect();
  console.log("DB Connected!");
  client.db(dbName).command({ ping: 1 });
  console.log("DB Ping Successful!");
}

export const CloseConnection = () => client.close();

export async function InsertUser(user: User): Promise<string> {
  const emailCheck = await FindUser({ email: user.email });
  if (emailCheck) {
    return "User with such email already exists!";
  }

  const usernameCheck = await FindUser({ username: user.username });
  if (usernameCheck) {
    return "User with such username already exists!";
  }

  await client.db(dbName).collection("Users").insertOne(user);
  console.log("New user created: " + user.username);
  return "OK";
}

export async function AuthenticateUser(user: User): Promise<string> {
  const userFound = await FindUser({ username: user.username });

  if (!userFound || userFound.password !== user.password) {
    return "Username os password is wrong";
  }

  console.log(`${user.username} has logged in!`);
  return "OK";
}

export async function GetUserId(user: User) {
  const userFound = await FindUser({ username: user.username });
  return userFound?._id.toString();
}

const FindUser = (criteria: { email: string } | { username: string }) =>
  client.db(dbName).collection("Users").findOne(criteria);
