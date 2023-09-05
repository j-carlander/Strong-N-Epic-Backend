import "dotenv/config";

import express from "express";
import cors from "cors";
import auth from "./router/authRouter.js";
import router from "./router/router.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.send("Up and running");
});

app.use("/auth", auth);
app.use("/api", router);

app.listen(port, () => {
  console.log(`server up and running on port ${port}`);
});
