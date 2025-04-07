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
				authorization: {
					select: {
						password: true
					}
				}
			}
		})

		if (!await pkg.verify(user.authorization.password, password))
			throw new Error("Invalid password");

		delete user.authorization;
		console.log("user:", user);
		return user;

	} catch (err) {
		throw new Error("User not found");
	}
}