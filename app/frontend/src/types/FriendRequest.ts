export type FriendRequest = {
  id: number;
  sender: boolean; // true if current user is the sender (outgoing), false if not (incoming)
  friendId: number;
  friendUsername: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
};
