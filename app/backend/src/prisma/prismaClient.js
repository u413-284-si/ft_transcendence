import { PrismaClient } from "@prisma/client";
import { updateWinRateMiddleware } from "./prismaMiddleware.js";

let prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"]
});

prisma.$use(updateWinRateMiddleware);

export default prisma;
