"use client";

import { createAvatar } from "@dicebear/core";
import { pixelArt } from "@dicebear/collection";
import { useMemo } from "react";

interface AvatarProps {
  seed: string;
  size?: number;
  className?: string;
}

export default function Avatar({
  seed,
  size = 64,
  className = "",
}: AvatarProps) {
  const avatarSvg = useMemo(() => {
    const avatar = createAvatar(pixelArt, {
      seed,
      size,
      backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
      radius: 20,
    });
    return avatar.toString();
  }, [seed, size]);

  return (
    <div
      className={`inline-block rounded-lg overflow-hidden ${className}`}
      dangerouslySetInnerHTML={{ __html: avatarSvg }}
      style={{ width: size, height: size }}
    />
  );
}
