export type FriendStatusChangeEvent = CustomEvent<{
  requestId: number;
  isOnline: boolean;
}>;

export type FriendRequestEvent = CustomEvent<{
  requestId: number;
  status: "PENDING" | "ACCEPTED" | "DELETED";
}>;
