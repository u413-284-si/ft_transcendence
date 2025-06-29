import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

import { seedUsers } from "./seeders/seedUser.js";
import { seedMatches } from "./seeders/seedMatches.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  faker.seed(1);

  const users = await seedUsers(10);

  for (const user of users) {
    const matchCount = faker.number.int({ min: 1, max: 10 });
    await seedMatches(user.id, matchCount);
  }

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
