import prisma from "../prisma/prismaClient.js";
import pkg from "argon2";

export async function loginUser(usernameOrEmail, password) {
	const user = await prisma.user.findUniqueOrThrow({
		where: {
			OR: [
				{ username: usernameOrEmail },
				{ email: usernameOrEmail }
			],
		}
	});

	if (!user)
		throw new Error("User not found");

	if (!await pkg.verify(user.authentication.password, password))
		throw new Error("Invalid password");

	return user;
}