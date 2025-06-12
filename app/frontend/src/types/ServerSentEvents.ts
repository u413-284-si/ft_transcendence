export type FriendStatusChangeEvent = CustomEvent<{
  userId: number;
  isOnline: boolean;
}>;

export type FriendRequestEvent = CustomEvent<{
  id: number;
  status: "PENDING" | "ACCEPTED" | "DELETED";
}>;
