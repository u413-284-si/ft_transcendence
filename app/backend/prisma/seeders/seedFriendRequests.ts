import { rand, randChanceBoolean } from "@ngneat/falso";
import {
  createFriendRequest,
  updateFriendRequest
} from "../../src/services/friends.services.js";
import { makePairKey } from "./utils.ts";

import type { User } from "@prisma/client";
import type { FriendRequest } from "../../../frontend/src/types/FriendRequest.ts";

export async function seedFriendRequests(users: User[], count = 30) {
  const userIds = users.map((user) => user.id);

  if (userIds.length < 2) {
    console.log("Need at least 2 users to create friend requests.");
    return;
  }

  const friendRequests = new Set();

  const createdRequests: FriendRequest[] = [];

  for (let i = 0; i < count; i++) {
    let senderId = rand(userIds);
    let receiverId = rand(userIds);

    // Ensure no self-request and no duplicate
    while (
      senderId === receiverId ||
      friendRequests.has(makePairKey(senderId, receiverId))
    ) {
      senderId = rand(userIds);
      receiverId = rand(userIds);
    }

    friendRequests.add(makePairKey(senderId, receiverId));

    const request = await createFriendRequest(senderId, receiverId);

    createdRequests.push(request);
  }

  // Decide randomly to accept or decline
  for (const request of createdRequests) {
    const accept = randChanceBoolean({ chanceTrue: 0.7 });

    if (accept) {
      await updateFriendRequest(request.id, request.friendId, "ACCEPTED");
    }
  }

  console.log(`Seeded ${createdRequests.length} friend requests`);
  return createdRequests;
}
