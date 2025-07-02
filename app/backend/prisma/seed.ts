import { seed } from "@ngneat/falso";
import prisma from "../src/prisma/prismaClient.js";

import { seedUsers } from "./seeders/seedUsers.ts";
import { seedMatchesPerUser } from "./seeders/seedMatches.ts";
import { seedFriendRequest } from "./seeders/seedFriendRequests.ts";

async function main() {
  console.log("Seeding database...");

  seed("42");

  const users = await seedUsers(10);

  await seedMatchesPerUser(users, 1, 10);

  await seedFriendRequest(users);

  console.log("Seeding complete!");
}

main()
  .catch((error) => {
    console.error("Error seeding: ", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
