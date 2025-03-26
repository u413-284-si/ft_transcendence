export function convertPrismaError(code) {
	switch (code) {
		case "P2002":
			return 400;
		case "P2025":
			return 404;
		default:
			return 500;
	}
};
