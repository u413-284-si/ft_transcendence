import { faker } from "@faker-js/faker";
import {
  createFriendRequest,
  updateFriendRequest
} from "../../src/services/friends.services.js";

function makePairKey(a, b) {
  const [min, max] = a < b ? [a, b] : [b, a];
  return `${min}:${max}`;
}

export async function seedFriendRequest(users, count = 30) {
  const userIds = users.map((user) => user.id);

  if (userIds.length < 2) {
    console.log("Need at least 2 users to create friend requests.");
    return;
  }

  const friendRequests = new Set();

  const createdRequests = [];

  for (let i = 0; i < count; i++) {
    let senderId = faker.helpers.arrayElement(userIds);
    let receiverId = faker.helpers.arrayElement(userIds);

    // Ensure no self-request and no duplicate
    while (
      senderId === receiverId ||
      friendRequests.has(makePairKey(senderId, receiverId))
    ) {
      senderId = faker.helpers.arrayElement(userIds);
      receiverId = faker.helpers.arrayElement(userIds);
    }

    friendRequests.add(makePairKey(senderId, receiverId));

    const request = await createFriendRequest(senderId, receiverId);

    createdRequests.push(request);
  }

  // Decide randomly to accept or decline
  for (const request of createdRequests) {
    const accept = faker.datatype.boolean();

    if (accept) {
      await updateFriendRequest(request.id, request.friendId, "ACCEPTED");
    }
  }

  console.log(`Seeded ${createdRequests.length} friend requests`);
  return createdRequests;
}
