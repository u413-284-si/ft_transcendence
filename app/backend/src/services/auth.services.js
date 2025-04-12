import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET
} from "../config/jwt.js";
import jwt from "jsonwebtoken";

export function authorizeUser(token) {
  const dedoced = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  return dedoced;
}
