export type FriendRequest = {
  id: number;
  status: "PENDING" | "ACCEPTED";
  sender: boolean; // true if current user is the sender (outgoing), false if not (incoming)
  friendId: number;
  friendUsername: string;
  friendAvatar: string | null;
  isOnline: boolean;
};
