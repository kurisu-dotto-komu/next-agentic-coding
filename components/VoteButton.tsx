"use client";

import { useState } from "react";

interface VoteButtonProps {
  type: "O" | "X";
  onVote: (vote: "O" | "X" | null) => void;
}

export default function VoteButton({ type, onVote }: VoteButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    onVote(type);
  };

  const handleRelease = () => {
    setIsPressed(false);
    onVote(null);
  };

  const baseClasses =
    "w-32 h-32 rounded-full text-6xl font-bold transition-all";
  const colorClasses =
    type === "O"
      ? "bg-green-500 hover:bg-green-600 text-white"
      : "bg-red-500 hover:bg-red-600 text-white";
  const pressedClasses = isPressed ? "scale-95 brightness-90" : "";

  return (
    <button
      data-testid={`vote-button-${type}`}
      className={`${baseClasses} ${colorClasses} ${pressedClasses}`}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
    >
      {type}
    </button>
  );
}
