"use client";

import { useState } from "react";

interface VoteButtonProps {
  type: "O" | "X";
  onVote: (voting: boolean) => void;
}

export default function VoteButton({ type, onVote }: VoteButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsPressed(true);
    onVote(true);
  };

  const handleEnd = () => {
    setIsPressed(false);
    onVote(false);
  };

  return (
    <button
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      className={`relative transition-all duration-200 ${
        isPressed ? "scale-110 animate-pulse" : "scale-100"
      }`}
      data-testid={`vote-button-${type}`}
    >
      <div
        className={`flex h-32 w-32 items-center justify-center rounded-full transition-all duration-200 ${
          type === "O" ? "bg-green-500" : "bg-red-500"
        } ${isPressed ? "shadow-lg shadow-gray-400" : ""}`}
      >
        <span className="text-4xl text-white">{type}</span>
      </div>
    </button>
  );
}
