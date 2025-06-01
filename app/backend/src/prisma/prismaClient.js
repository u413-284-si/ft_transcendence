import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"]
});

export default prisma;
