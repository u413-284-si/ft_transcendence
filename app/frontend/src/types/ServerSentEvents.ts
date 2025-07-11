export type FriendStatusChangeEvent = CustomEvent<{
  requestId: number;
  username: string;
  isOnline: boolean;
}>;

export type FriendRequestEvent = CustomEvent<{
  requestId: number;
  username: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "RESCINDED" | "DELETED";
}>;
