"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import AnimatedVotingAvatar from "@/app/components/AnimatedVotingAvatar";
import QRCode from "@/app/components/QRCode";
import VoteBar from "@/app/components/VoteBar";

export default function VotingDesktop() {
  const users = useQuery(api.votes.getCurrentVotes) || [];
  const stats = useQuery(api.votes.getVoteStats) || {
    total: 0,
    votingO: 0,
    votingX: 0,
    notVoting: 0,
  };

  const getAvatarSize = () => {
    if (users.length <= 20) return "h-20 w-20";
    if (users.length <= 50) return "h-16 w-16";
    return "h-12 w-12";
  };

  return (
    <div className="min-h-screen p-8">
      <QRCode />

      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold">Live Voting Session</h1>

        <div className="mb-8">
          <VoteBar stats={stats} />
        </div>

        <div className="rounded-lg bg-gray-50 p-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {users.map((user) => (
              <AnimatedVotingAvatar
                key={user._id}
                avatarSeed={user.avatarSeed}
                currentVote={user.currentVote}
                className={getAvatarSize()}
              />
            ))}
          </div>

          {users.length === 0 && (
            <p className="text-center text-gray-500">Waiting for participants to join...</p>
          )}
        </div>
      </div>
    </div>
  );
}
