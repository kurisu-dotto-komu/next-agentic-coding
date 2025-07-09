"use client";

import { useState, useEffect } from "react";
import Avatar from "@/components/Avatar";
import VoteButton from "@/components/VoteButton";
import { User, VoteType } from "@/types/vote";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface MobileVoteViewProps {
  user: User;
  currentVote: VoteType;
}

export default function MobileVoteView({
  user,
  currentVote,
}: MobileVoteViewProps) {
  const [vote, setVote] = useState<VoteType>(currentVote);
  const castVote = useMutation(api.votes.castVote);

  useEffect(() => {
    setVote(currentVote);
  }, [currentVote]);

  const handleVote = async (newVote: VoteType) => {
    setVote(newVote);
    await castVote({
      userId: user._id as Id<"users">,
      vote: newVote,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="mb-8">
        <Avatar
          seed={user.avatarSeed}
          size={160}
          showVote={vote !== null}
          vote={vote}
        />
      </div>

      <div className="flex gap-6">
        <VoteButton type="O" onVote={handleVote} />
        <VoteButton type="X" onVote={handleVote} />
      </div>
    </div>
  );
}
