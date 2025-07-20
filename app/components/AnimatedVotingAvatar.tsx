"use client";

import { useMemo } from "react";

import UserAvatar from "@/app/components/UserAvatar";

interface AnimatedVotingAvatarProps {
  avatarSeed: string;
  currentVote: "O" | "X" | null;
  className?: string;
}

export default function AnimatedVotingAvatar({
  avatarSeed,
  currentVote,
  className = "",
}: AnimatedVotingAvatarProps) {
  const animationDelay = useMemo(() => {
    const hash = avatarSeed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 1000) / 1000;
  }, [avatarSeed]);

  const animationClass = currentVote
    ? `animate-voting ${currentVote === "O" ? "animate-voting-o" : "animate-voting-x"}`
    : "";

  return (
    <div className={`relative ${animationClass}`} style={{ animationDelay: `${animationDelay}s` }}>
      <UserAvatar avatarSeed={avatarSeed} className={className} />
      {currentVote && (
        <div
          className={`absolute -top-2 -right-2 flex h-8 w-8 animate-bounce items-center justify-center rounded-full text-white ${
            currentVote === "O" ? "bg-green-500" : "bg-red-500"
          }`}
          data-testid={`user-vote-${currentVote}`}
          style={{ animationDelay: `${animationDelay * 0.5}s` }}
        >
          <span className="text-xs font-bold">{currentVote}</span>
        </div>
      )}
    </div>
  );
}
