import { MongoClient, Db } from "mongodb";

let dbConnection = undefined;

const mongoUser = process.env.MONGO_USER || undefined;
const mongoPass = process.env.MONGO_PASS || undefined;
const URI = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0.slu32r7.mongodb.net/?retryWrites=true&w=majority`;

function connect() {
  if (dbConnection != undefined) {
    return dbConnection;
  }

  try {
    if (!mongoUser || !mongoPass)
      throw new Error("Missing Credentials for Mongo DB");
    const client = new MongoClient(URI);
    dbConnection = client.db("Strong-N-Epic");
    console.log("Connected to MongoDB, Strong-N-Epic");
    return dbConnection;
  } catch (error) {
    console.error(error);
  }
}

export function fetchCollection(name) {
  return connect()?.collection(name);
}
