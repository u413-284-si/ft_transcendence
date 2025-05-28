export type FriendStatusChangeEvent = CustomEvent<{
  userId: number;
  isOnline: boolean;
}>;
