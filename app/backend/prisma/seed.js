import { seed } from "@ngneat/falso";
import prisma from "../src/prisma/prismaClient.js";

import { seedUsers } from "./seeders/seedUser.js";
import { seedMatchesPerUser } from "./seeders/seedMatches.js";
import { seedFriendRequest } from "./seeders/seedFriendRequest.js";

async function main() {
  console.log("Seeding database...");

  seed(1);

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
