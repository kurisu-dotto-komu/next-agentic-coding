import { Id } from "@/convex/_generated/dataModel";

export interface User {
  _id: Id<"users">;
  sessionId: string;
  avatarSeed: string;
  _creationTime: number;
  lastSeen: number;
}

export interface Vote {
  _id: Id<"votes">;
  userId: Id<"users">;
  vote: "O" | "X" | null;
  timestamp: number;
}

export type VoteType = "O" | "X" | null;

export interface VoteStats {
  oCount: number;
  xCount: number;
  noVoteCount: number;
  totalUsers: number;
  oPercentage: number;
  xPercentage: number;
  noVotePercentage: number;
}

export interface UserWithVote extends User {
  currentVote: VoteType;
}
