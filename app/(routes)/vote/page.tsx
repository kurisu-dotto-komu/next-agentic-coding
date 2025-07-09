"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getSessionId } from "@/lib/session";
import { useViewport } from "@/lib/viewport";
import MobileVoteView from "@/components/MobileVoteView";
import DesktopVoteView from "@/components/DesktopVoteView";
import { User } from "@/types/vote";

export default function VotePage() {
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const viewport = useViewport();

  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const updateLastSeen = useMutation(api.users.updateLastSeen);

  const user = useQuery(api.users.getUserById, userId ? { userId } : "skip") as
    | User
    | undefined;

  const userVote = useQuery(
    api.votes.getUserVote,
    userId ? { userId } : "skip",
  );

  const activeUsers = useQuery(api.users.listActiveUsers) || [];
  const currentVotes = useQuery(api.votes.getCurrentVotes) || [];
  const stats = useQuery(api.votes.getVoteStats) || {
    percentages: { O: 0, X: 0, none: 100 },
  };

  // Initialize user
  useEffect(() => {
    const initUser = async () => {
      const sessionId = getSessionId();
      if (sessionId) {
        const id = await getOrCreateUser({ sessionId });
        setUserId(id);
      }
    };
    initUser();
  }, [getOrCreateUser]);

  // Update last seen periodically
  useEffect(() => {
    if (userId) {
      updateLastSeen({ userId });
      const interval = setInterval(() => {
        updateLastSeen({ userId });
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [userId, updateLastSeen]);

  // Prepare users with votes for desktop view
  const usersWithVotes = activeUsers.map((activeUser) => {
    const userVote = currentVotes.find(
      (vote) => vote.userId === activeUser._id,
    );
    return {
      user: activeUser,
      vote: userVote?.vote || null,
    };
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (viewport === "mobile") {
    return <MobileVoteView user={user} currentVote={userVote || null} />;
  }

  return <DesktopVoteView stats={stats} usersWithVotes={usersWithVotes} />;
}
