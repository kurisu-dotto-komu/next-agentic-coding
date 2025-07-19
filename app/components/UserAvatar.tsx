"use client";

import { useMemo } from "react";

import { lorelei } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

interface UserAvatarProps {
  avatarSeed: string;
  className?: string;
}

export default function UserAvatar({ avatarSeed, className = "" }: UserAvatarProps) {
  const avatarDataUri = useMemo(() => {
    const avatar = createAvatar(lorelei, {
      seed: avatarSeed,
      size: 64,
    });
    return avatar.toDataUri();
  }, [avatarSeed]);

  return (
    <img
      src={avatarDataUri}
      alt="User avatar"
      className={`rounded-full ${className}`}
      width={64}
      height={64}
      data-testid="user-avatar"
    />
  );
}
