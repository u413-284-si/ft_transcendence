export type FriendStatusChangeEvent = CustomEvent<{
  requestId: number;
  username: string;
  isOnline: boolean;
}>;

export type FriendRequestEvent = CustomEvent<{
  requestId: number;
  status: "PENDING" | "ACCEPTED" | "DELETED";
}>;
