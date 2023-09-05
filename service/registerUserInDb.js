import { fetchCollection } from "../mongodb/mongodb.js";

async function registerUserInDb(user) {
  const dbUser = await fetchCollection("users")?.findOne({
    username: user.username,
  });

  if (!dbUser) {
    const result = await fetchCollection("users")?.insertOne(user);
    return { status: 201, msg: "Created", result: result };
  } else {
    return { status: 400, msg: "User already exist" };
  }
}

export default registerUserInDb;
