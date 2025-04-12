import { JWT_ACCESS_TOKEN_SECRET } from "../config/jwt.js";
import jwt from "jsonwebtoken";
import pkg from "argon2";

export function authorizeUser(token) {
  const dedoced = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  return dedoced;
}

export async function createHashedPassword(password) {
  const hashedPassword = await pkg.hash(password, {
    type: pkg.argon2id,
    memoryCost: 47104,
    parallelism: 1
  });
  return hashedPassword;
}

export async function verifyPassword(databasePassword, loginPassword) {
  return pkg.verify(databasePassword, loginPassword);
}

export function createAccessToken(user) {
  return jwt.sign(user, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "15m"
  });
}
