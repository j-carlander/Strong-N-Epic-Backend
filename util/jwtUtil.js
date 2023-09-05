import jwt from "jsonwebtoken";

function generateToken(payload) {
  const payloadOptions = {
    issuer: "ToDo React TS",
    subject: "send and receive access token",
    // expiresIn: "15m", // 15 minutes
  };
  const secret = process.env.JWT_SECRET;

  if (!secret) throw new Error("Missing Secret string for JWT token creation");

  const token = jwt.sign(payload, secret, payloadOptions);
  return token;
}

export default { generateToken };
