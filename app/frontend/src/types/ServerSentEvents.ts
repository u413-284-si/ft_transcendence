export type FriendStatusChangeEvent = CustomEvent<{
  userId: number;
  isOnline: boolean;
}>;

export type FriendRequestEvent = CustomEvent<{
  requestId: number;
  status: "PENDING" | "ACCEPTED" | "DELETED";
}>;
