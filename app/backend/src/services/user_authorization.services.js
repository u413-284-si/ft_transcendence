import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "../config/jwt.js";
import jwt from "jsonwebtoken";

export async function authorizeUser(token){

	try {
		const dedoced = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
		return dedoced;
	} catch (err) {
		throw new Error("Invalid token");
	}
}