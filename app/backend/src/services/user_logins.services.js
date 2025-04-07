import { commonDefinitionsSchema } from "../schema/common.schema.js";
import prisma from "../prisma/prismaClient.js";
import pkg from "argon2";

export async function loginUser(usernameOrEmail, password) {

	try {
		const user = await prisma.user.findFirst({
			where: {
				OR: [
				{ email: usernameOrEmail },
				{ username: usernameOrEmail}
				]
			},
			include: {
				authentication: {
					select: {
						password: true
					}
				}
			}
		})

		if (!await pkg.verify(user.authentication.password, password))
			throw new Error("Invalid password");

		return user;

	} catch (err) {
		throw new Error("User not found");
	}
}