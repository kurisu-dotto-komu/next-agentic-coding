"use client";

import Avatar from "@/components/Avatar";
import { User } from "@/types/vote";

interface UserWithVote {
  user: User;
  vote: "O" | "X" | null;
}

interface UserGridProps {
  usersWithVotes: UserWithVote[];
}

export default function UserGrid({ usersWithVotes }: UserGridProps) {
  return (
    <div data-testid="user-grid" className="p-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-3">
        {usersWithVotes.map(({ user, vote }) => {
          const isRecent = Date.now() - user.lastSeen < 10000; // Active in last 10 seconds
          return (
            <div
              key={user._id}
              data-testid="grid-avatar"
              className={`flex flex-col items-center p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all ${
                isRecent ? "ring-2 ring-blue-400 ring-opacity-50" : ""
              }`}
            >
              {isRecent && (
                <div data-testid="user-active" className="sr-only">
                  Active user
                </div>
              )}
              <Avatar
                seed={user.avatarSeed}
                size={64}
                showVote={vote !== null}
                vote={vote}
                testId={`avatar-${user._id}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
