import express from "express";
import bcrypt from "bcrypt";
import jwtUtil from "../util/jwtUtil.js";
import registerUserInDb from "../service/registerUserInDb.js";
import { fetchCollection } from "../mongodb/mongodb.js";

const auth = express.Router();

// for user log in
auth.post("/login", async (req, res) => {
  const dbUser = await fetchCollection("users")?.findOne({
    username: req.body.username,
  });

  if (!dbUser)
    return res.status(400).json({ msg: "wrong username or password" });

  const passwordMatch = await bcrypt.compare(
    req.body.password,
    dbUser.password
  );

  if (passwordMatch) {
    const userDetails = {
      username: dbUser.username,
      role: dbUser.role,
      bookedWorkouts: dbUser.bookedWorkouts,
    };
    const token = jwtUtil.generateToken(userDetails);
    const responseBody = {
      jwt: token,
      details: userDetails,
    };
    res.status(200).json(responseBody);
  } else {
    res.status(400).json({ msg: "wrong username or password" });
  }
});

// for user registration
auth.post("/register", async (req, res) => {
  if (req.body.username == undefined || req.body.password == undefined) {
    return res.status(400).send("Missing user details");
  }

  const dbUser = await fetchCollection("users")?.findOne({
    username: req.body.username,
  });

  if (dbUser) return res.status(400).json({ msg: "Username already in use" });

  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const user = {...req.body,
    password: passwordHash,
    role: "USER",
    bookedWorkouts: [],
  };

  const registered = await registerUserInDb(user);
  res.status(registered.status).json(registered.result);
});

export default auth;
