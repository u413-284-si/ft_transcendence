import { randUserName, randEmail } from "@ngneat/falso";

import { createUser } from "../../src/services/users.services.js";
import { createHash } from "../../src/services/auth.services.js";

export async function seedUsers(count = 10) {
  const users = [];

  const adminUsername = "admin";
  const adminEmail = "admin@example.com";
  const adminPassword = await createHash("123");
  const authProvider = "LOCAL";

  const adminUser = await createUser(
    adminUsername,
    adminEmail,
    adminPassword,
    authProvider
  );

  users.push(adminUser);

  for (let i = 1; i < count; i++) {
    const username = randUserName({ withAccents: false });
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
