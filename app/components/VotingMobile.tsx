"use client";

import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import UserAvatar from "@/app/components/UserAvatar";
import VoteButton from "@/app/components/VoteButton";

interface VotingMobileProps {
  userId: Id<"users">;
}

export default function VotingMobile({ userId }: VotingMobileProps) {
  const user = useQuery(api.users.getUser, { userId });
  const setVote = useMutation(api.votes.setVote);
  const clearVote = useMutation(api.votes.clearVote);

  const handleVote = async (type: "O" | "X", voting: boolean) => {
    if (voting) {
      await setVote({ userId, vote: type });
    } else {
      await clearVote({ userId });
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <UserAvatar avatarSeed={user.avatarSeed} className="h-32 w-32" />

      <div className="flex gap-8">
        <VoteButton type="O" onVote={(voting) => handleVote("O", voting)} />
        <VoteButton type="X" onVote={(voting) => handleVote("X", voting)} />
      </div>

      <p className="text-center text-gray-600">Hold a button to vote!</p>
    </div>
  );
}
