import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  faker.seed(1);

  for (let i = 0; i < 10; i++) {
    const username = faker.internet.username();
    const email = faker.internet.email({ firstName: username });
    const avatar = "/images/default-avatar.png";
    const dateJoined = faker.date.past({ years: 1 });

    await prisma.user.create({
      data: {
        username,
        email,
        avatar,
        dateJoined
      }
    });
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
