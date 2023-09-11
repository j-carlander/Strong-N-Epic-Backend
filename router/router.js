import express from "express";

import authFilter from "../filter/authFilter.js";
import { fetchCollection } from "../mongodb/mongodb.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// adding middelware,
// all routes below needs to authorize
router.use(authFilter.auth);

// Get a list of all workouts available
router.get("/workout", async (req, res) => {
  try {
    const result = await fetchCollection("workout").find().toArray();
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

// Book a workout, update participants list
router.patch("/workout/:action", async (req, res) => {
  try {
    if (req.params.action === "BOOK") {
      const result = await Promise.all([
        fetchCollection("workout").updateOne(
          { _id: new ObjectId(req.body.id) },
          { $push: { participants: req.body.participant } } // $push one user might be a better choice
        ),
        fetchCollection("users").updateOne(
          { username: req.body.participant },
          { $push: { bookedWorkouts: req.body.id } } // $push one user might be a better choice
        ),
      ]);
      res.status(200).json(result);
    } else if (req.params.action === "CANCEL") {
      const result = await Promise.all([
        fetchCollection("workout").updateOne(
          { _id: new ObjectId(req.body.id) },
          { $pull: { participants: req.body.participant } } // $push one user might be a better choice
        ),
        fetchCollection("users").updateOne(
          { username: req.body.participant },
          { $pull: { bookedWorkouts: req.body.id } } // $push one user might be a better choice
        ),
      ]);
      res.status(204).json(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

// adding middleware
// all routes below need to be admin
router.use(authFilter.admin);

router.post("/workout", async (req, res) => {
  const workout = { ...req.body, _id: null };

  const workouts = [];
  const recursSoManyTimes = workout.recurring === "just_once" ? 1 : 10;
  const recursInDays =
    workout.recurring === "just_once"
      ? 0
      : workout.recurring === "every_week"
      ? 7
      : 14;
  const startTime = new Date(workout.startTime);

  const workoutCollection = await fetchCollection("workout");
  if (!workoutCollection)
    return res.status(500).json({ msg: "Something went wrong" });

  for (let i = 0; i < recursSoManyTimes; i++) {
    workouts.push({
      ...workout,
      startTime: startTime.setDate(startTime.getDate() + recursInDays),
    });

    try {
      const result = await workoutCollection.insertMany(workouts);
      res.status(201).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
});

router.get("/user", async (req, res) => {
  try {
    const result = await fetchCollection("users")
      .find()
      .project({ password: 0 })
      .toArray();
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

export default router;
