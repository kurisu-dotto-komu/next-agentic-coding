"use client";

interface VoteBarProps {
  stats: {
    percentages: {
      O: number;
      X: number;
      none: number;
    };
  };
}

export default function VoteBar({ stats }: VoteBarProps) {
  const { O, X, none } = stats.percentages;

  return (
    <div
      data-testid="vote-bar"
      className="w-full p-4 bg-white rounded-lg shadow-md"
    >
      <div className="flex h-12 rounded-lg overflow-hidden">
        {O > 0 && (
          <div
            data-testid="vote-bar-O"
            className="bg-green-500 flex items-center justify-center text-white font-bold transition-all duration-500"
            style={{ width: `${O}%` }}
          >
            {O}%
          </div>
        )}

        {X > 0 && (
          <div
            data-testid="vote-bar-X"
            className="bg-red-500 flex items-center justify-center text-white font-bold transition-all duration-500"
            style={{ width: `${X}%` }}
          >
            {X}%
          </div>
        )}

        {none > 0 && (
          <div
            data-testid="vote-bar-none"
            className="bg-gray-300 flex items-center justify-center text-gray-700 font-bold transition-all duration-500"
            style={{ width: `${none}%` }}
          >
            {none}%
          </div>
        )}
      </div>

      <div className="flex justify-between mt-2 text-sm">
        <span className="text-green-600 font-medium">O: {O}%</span>
        <span className="text-red-600 font-medium">X: {X}%</span>
        <span className="text-gray-600 font-medium">No Vote: {none}%</span>
      </div>
    </div>
  );
}
