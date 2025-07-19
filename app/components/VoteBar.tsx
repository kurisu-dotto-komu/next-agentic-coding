"use client";

interface VoteBarProps {
  stats: {
    total: number;
    votingO: number;
    votingX: number;
    notVoting: number;
  };
}

export default function VoteBar({ stats }: VoteBarProps) {
  const getPercentage = (value: number) => {
    if (stats.total === 0) return 0;
    return (value / stats.total) * 100;
  };

  return (
    <div className="w-full" data-testid="vote-bar">
      <div className="mb-2 flex justify-between text-sm text-gray-600">
        <span>Total participants: {stats.total}</span>
        <div className="flex gap-4">
          <span>O: {stats.votingO}</span>
          <span>X: {stats.votingX}</span>
          <span>Not voting: {stats.notVoting}</span>
        </div>
      </div>

      <div className="flex h-12 w-full overflow-hidden rounded-lg bg-gray-200">
        <div
          className="flex items-center justify-center bg-green-500 text-white transition-all duration-300"
          style={{ width: `${getPercentage(stats.votingO)}%` }}
        >
          {stats.votingO > 0 && <span className="text-sm font-bold">O</span>}
        </div>
        <div
          className="flex items-center justify-center bg-red-500 text-white transition-all duration-300"
          style={{ width: `${getPercentage(stats.votingX)}%` }}
        >
          {stats.votingX > 0 && <span className="text-sm font-bold">X</span>}
        </div>
        <div
          className="transition-all duration-300"
          style={{ width: `${getPercentage(stats.notVoting)}%` }}
        />
      </div>
    </div>
  );
}
