import { Position } from "./types";

export function calculatePlayerPosition(
  index: number,
  totalPlayers: number,
): Position {
  // Arrange players in a semi-circle
  const angle = (Math.PI / (totalPlayers + 1)) * (index + 1);
  const radius = 200;
  const centerX = 400;
  const centerY = 300;

  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle) * 0.5, // Flatten the circle
  };
}

export function generateRandomPosition(): Position {
  return {
    x: Math.random() * 600 + 100,
    y: Math.random() * 300 + 100,
  };
}
