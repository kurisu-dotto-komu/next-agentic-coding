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
      className={`relative transition-transform ${isPressed ? "scale-95" : "scale-100"}`}
      data-testid={`vote-button-${type}`}
    >
      <div
        className={`flex h-32 w-32 items-center justify-center rounded-full ${
          type === "O" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <span className="text-4xl text-white">{type}</span>
      </div>

      {isPressed && (
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 animate-bounce rounded border-2 border-gray-800 bg-white p-2"
          data-testid={`vote-indicator-${type}`}
        >
          <span className="text-2xl">{type}</span>
        </div>
      )}
    </button>
  );
}
