import prisma from "../prisma/prismaClient.js";

export async function loginUser(usernameOrEmail, password) {
	const user = await prisma.user.findUniqueOrThrow({
		where: {
			OR: [
				{ username: usernameOrEmail },
				{ email: usernameOrEmail }
			],
			AND: {
				authentication: {
					password: password
				}
			}
		}
	});
	return user;
}