"use client";

import VoteBar from "@/components/VoteBar";
import UserGrid from "@/components/UserGrid";
import QRCode from "@/components/QRCode";
import { User } from "@/types/vote";

interface DesktopVoteViewProps {
  stats: {
    percentages: {
      O: number;
      X: number;
      none: number;
    };
  };
  usersWithVotes: Array<{
    user: User;
    vote: "O" | "X" | null;
  }>;
}

export default function DesktopVoteView({
  stats,
  usersWithVotes,
}: DesktopVoteViewProps) {
  const voteUrl =
    typeof window !== "undefined" ? `${window.location.origin}/vote` : "/vote";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <div className="absolute top-4 right-4">
          <QRCode url={voteUrl} size={150} />
        </div>

        <div className="max-w-4xl mx-auto pt-8 px-4">
          <h1 className="text-3xl font-bold text-center mb-2">
            Real-time Voting Results
          </h1>

          <p className="text-center text-gray-600 mb-6">
            {usersWithVotes.length} active{" "}
            {usersWithVotes.length === 1 ? "user" : "users"}
          </p>

          <VoteBar stats={stats} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <UserGrid usersWithVotes={usersWithVotes} />
      </div>
    </div>
  );
}
