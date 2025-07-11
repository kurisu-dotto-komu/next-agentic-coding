export const CANVAS_SIZE = 1024;
export const GAME_SIZE = 100;
export const SCALE = CANVAS_SIZE / GAME_SIZE;
export const SPRITE_SIZE = 16;

export interface Tamagochi {
  _id: string;
  userId: string;
  name: string;
  pixelData: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  stats: { hunger: number; happiness: number; health: number };
  alive: boolean;
  birthTime: number;
  lastUpdated: number;
  animations: { current: string; startTime: number };
}

export function drawTamagochi(
  ctx: CanvasRenderingContext2D,
  pet: Tamagochi,
  sprite: HTMLImageElement | undefined,
) {
  if (!sprite) return;

  // Calculate canvas position
  const canvasX = pet.position.x * SCALE;
  const canvasY = pet.position.y * SCALE;

  // Apply animation effects
  const animTime = Date.now() - pet.animations.startTime;
  let offsetY = 0;
  let scale = 1;

  switch (pet.animations.current) {
    case "feed":
      // Bounce effect
      offsetY = Math.sin(animTime * 0.01) * 5;
      break;
    case "pet":
      // Wiggle effect
      ctx.save();
      ctx.translate(canvasX + (SPRITE_SIZE * SCALE) / 2, canvasY + (SPRITE_SIZE * SCALE) / 2);
      ctx.rotate(Math.sin(animTime * 0.01) * 0.1);
      ctx.translate(-(canvasX + (SPRITE_SIZE * SCALE) / 2), -(canvasY + (SPRITE_SIZE * SCALE) / 2));
      break;
    case "heal":
      // Pulse effect
      scale = 1 + Math.sin(animTime * 0.01) * 0.1;
      break;
    case "dance":
      // Easter egg: Dance animation - spin and bounce
      ctx.save();
      ctx.translate(canvasX + (SPRITE_SIZE * SCALE) / 2, canvasY + (SPRITE_SIZE * SCALE) / 2);
      ctx.rotate(animTime * 0.005);
      ctx.translate(-(canvasX + (SPRITE_SIZE * SCALE) / 2), -(canvasY + (SPRITE_SIZE * SCALE) / 2));
      offsetY = Math.sin(animTime * 0.02) * 10;
      break;
    case "celebrate":
      // Easter egg: Celebration - rainbow effect
      scale = 1 + Math.sin(animTime * 0.02) * 0.2;
      offsetY = Math.abs(Math.sin(animTime * 0.01)) * -15;
      // Add rainbow filter
      ctx.filter = `hue-rotate(${animTime * 0.5}deg)`;
      break;
  }

  // Draw shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.beginPath();
  ctx.ellipse(
    canvasX + (SPRITE_SIZE * SCALE) / 2,
    canvasY + SPRITE_SIZE * SCALE + 5,
    (SPRITE_SIZE * SCALE) / 3,
    (SPRITE_SIZE * SCALE) / 6,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Draw sprite
  ctx.imageSmoothingEnabled = false;
  const spriteScale = SCALE * scale;
  ctx.drawImage(
    sprite,
    canvasX - ((spriteScale - SCALE) * SPRITE_SIZE) / 2,
    canvasY + offsetY - ((spriteScale - SCALE) * SPRITE_SIZE) / 2,
    SPRITE_SIZE * spriteScale,
    SPRITE_SIZE * spriteScale,
  );

  if (pet.animations.current === "pet" || pet.animations.current === "dance") {
    ctx.restore();
  }

  // Reset filter if celebration animation was used
  if (pet.animations.current === "celebrate") {
    ctx.filter = "none";
  }

  // Draw name tag
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  const textWidth = ctx.measureText(pet.name).width;
  ctx.fillRect(
    canvasX + (SPRITE_SIZE * SCALE) / 2 - textWidth / 2 - 4,
    canvasY - 20,
    textWidth + 8,
    18,
  );
  ctx.fillStyle = "white";
  ctx.fillText(pet.name, canvasX + (SPRITE_SIZE * SCALE) / 2, canvasY - 6);

  // Draw health indicator if low
  if (pet.stats.health < 30 || pet.stats.hunger < 30 || pet.stats.happiness < 30) {
    ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
    ctx.font = "20px monospace";
    ctx.fillText("!", canvasX + SPRITE_SIZE * SCALE + 5, canvasY + 10);
  }
}

export function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  for (let i = 0; i <= GAME_SIZE; i += 10) {
    ctx.beginPath();
    ctx.moveTo(i * SCALE, 0);
    ctx.lineTo(i * SCALE, CANVAS_SIZE);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * SCALE);
    ctx.lineTo(CANVAS_SIZE, i * SCALE);
    ctx.stroke();
  }
}
