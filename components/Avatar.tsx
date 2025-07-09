"use client";

import { generateAvatar } from "@/lib/avatars";
import { VoteType } from "@/types/vote";
import { useMemo } from "react";

interface AvatarProps {
  seed: string;
  size?: number;
  showVote?: boolean;
  vote?: VoteType;
  testId?: string;
}

export default function Avatar({
  seed,
  size = 96,
  showVote = false,
  vote,
  testId = "user-avatar",
}: AvatarProps) {
  const avatarUri = useMemo(() => generateAvatar(seed, size), [seed, size]);

  return (
    <div className="relative inline-block" data-testid={testId}>
      <img
        src={avatarUri}
        alt="User avatar"
        width={size}
        height={size}
        className="rounded-full"
      />

      {showVote && vote && (
        <div
          data-testid="vote-whiteboard"
          className="absolute -top-4 -right-4 bg-white border-2 border-gray-800 
                     rounded-lg shadow-lg p-2 animate-in fade-in zoom-in duration-200"
        >
          <span
            className={`text-2xl font-bold ${
              vote === "O" ? "text-green-600" : "text-red-600"
            }`}
          >
            {vote}
          </span>
        </div>
      )}
    </div>
  );
}
