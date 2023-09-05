import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const authHeader = req.headers["authorization"]
    ? req.headers["authorization"]
    : undefined;

  if (!authHeader)
    return res.status(401).json({ msg: "Authorization header is missing" }); // Unauthorized

  const authToken = authHeader.replace("Bearer ", "");

  const secret = process.env.JWT_SECRET;
  try {
    const authorized = jwt.verify(authToken, secret);
    console.log(authorized);
    res.locals.userDetails = { ...authorized };
    next();
  } catch (err) {
    console.log(err.name);
    res.status(400).json({ msg: "Invalid token" });
  }
}

function admin(req, res, next) {
  console.log("authfilter admin: ", res.locals.userDetails.role);
  if (res.locals.userDetails.role !== "ADMIN")
    return res.status(403).send("Not allowed");
  next();
}
export default { auth, admin };
