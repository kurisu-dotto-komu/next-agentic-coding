"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import QRCode from "@/app/components/QRCode";
import UserAvatar from "@/app/components/UserAvatar";
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
              <div key={user._id} className="relative">
                <UserAvatar avatarSeed={user.avatarSeed} className={getAvatarSize()} />
                {user.currentVote && (
                  <div
                    className={`absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full text-white ${
                      user.currentVote === "O" ? "bg-green-500" : "bg-red-500"
                    }`}
                    data-testid={`user-vote-${user.currentVote}`}
                  >
                    <span className="text-xs font-bold">{user.currentVote}</span>
                  </div>
                )}
              </div>
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
