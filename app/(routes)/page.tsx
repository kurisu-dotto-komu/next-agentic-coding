"use client";

import { useEffect, useState } from "react";

import { useMutation } from "convex/react";

import { getOrCreateSessionId } from "@/app/utils/session";
import { useViewport } from "@/app/utils/viewport";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import VotingDesktop from "@/app/components/VotingDesktop";
import VotingMobile from "@/app/components/VotingMobile";

export default function Home() {
  const { isMobile } = useViewport();
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const updateLastSeen = useMutation(api.users.updateLastSeen);

  useEffect(() => {
    const initUser = async () => {
      const sessionId = getOrCreateSessionId();
      if (sessionId) {
        const id = await getOrCreateUser({ sessionId });
        setUserId(id);
      }
    };

    initUser();
  }, [getOrCreateUser]);

  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      updateLastSeen({ userId });
    }, 30000);

    return () => clearInterval(interval);
  }, [userId, updateLastSeen]);

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Initializing...</div>
      </div>
    );
  }

  return isMobile ? <VotingMobile userId={userId} /> : <VotingDesktop />;
}
