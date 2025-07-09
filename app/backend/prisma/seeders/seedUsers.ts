import { randEmail } from "@ngneat/falso";

import {
  createRandomUsername,
  createUser
} from "../../src/services/users.services.js";
import { createHash } from "../../src/services/auth.services.js";
import type { User } from "@prisma/client";

export async function seedUsers(count = 10) {
  const users: User[] = [];

  const adminUsername = "admin";
  const adminEmail = "admin@example.com";
  const adminPassword = await createHash("123");
  const authProvider = "LOCAL";

  const adminUser: User = await createUser(
    adminUsername,
    adminEmail,
    adminPassword,
    authProvider
  );

  users.push(adminUser);

  for (let i = 1; i < count; i++) {
    const username = createRandomUsername();
    const email = randEmail();
    const hashedPassword = await createHash("123");
    const authProvider = "LOCAL";

    const user = await createUser(
      username,
      email,
      hashedPassword,
      authProvider
    );

    users.push(user);
  }

  console.log(`Seeded ${users.length} users`);
  return users;
}
