"use client";

import { motion } from "framer-motion";
import Avatar from "@/components/ui/Avatar";
import { Player, Position } from "@/lib/game/types";

interface CharacterProps {
  player: Player;
  position: Position;
  isCurrentPlayer?: boolean;
}

export default function Character({
  player,
  position,
  isCurrentPlayer = false,
}: CharacterProps) {
  return (
    <motion.div
      className="absolute flex flex-col items-center"
      initial={{ x: position.x, y: position.y, scale: 0 }}
      animate={{
        x: position.x,
        y: position.y,
        scale: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <div
          className={`relative ${isCurrentPlayer ? "ring-2 ring-amber-400 ring-offset-2 rounded-lg" : ""}`}
        >
          <Avatar seed={player.avatarSeed} size={48} />
          {isCurrentPlayer && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </motion.div>

      <div className="mt-1 text-center">
        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 px-2 py-0.5 rounded">
          {player.name}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Lv. {player.level}
        </p>
      </div>
    </motion.div>
  );
}
