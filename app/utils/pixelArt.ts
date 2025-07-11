// Seeded random number generator
function seedRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return function () {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };
}

// Color palettes for different tamagochi variations
const colorPalettes = [
  // Warm palette
  { primary: [255, 150, 100], secondary: [255, 200, 150], accent: [255, 100, 50] },
  // Cool palette
  { primary: [100, 150, 255], secondary: [150, 200, 255], accent: [50, 100, 255] },
  // Nature palette
  { primary: [100, 255, 100], secondary: [150, 255, 150], accent: [50, 200, 50] },
  // Purple palette
  { primary: [200, 100, 255], secondary: [230, 150, 255], accent: [150, 50, 200] },
  // Pink palette
  { primary: [255, 150, 200], secondary: [255, 200, 230], accent: [255, 100, 150] },
  // Yellow palette
  { primary: [255, 200, 100], secondary: [255, 230, 150], accent: [255, 150, 50] },
];

function generateColor(rng: () => number, palette: (typeof colorPalettes)[0]) {
  const colorType = rng();
  if (colorType < 0.5) {
    return palette.primary;
  } else if (colorType < 0.8) {
    return palette.secondary;
  } else {
    return palette.accent;
  }
}

function setPixel(
  pixels: Uint8Array,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  size: number,
) {
  const index = (y * size + x) * 4;
  pixels[index] = r;
  pixels[index + 1] = g;
  pixels[index + 2] = b;
  pixels[index + 3] = 255; // Full opacity
}

function pixelsToBase64(pixels: Uint8Array, width: number, height: number): string {
  // Create a canvas to convert pixels to base64
  if (typeof window === "undefined") {
    // Server-side fallback - return a placeholder
    return "";
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/png");
}

export function generateTamagochiSprite(seed: string): string {
  const rng = seedRandom(seed);
  const size = 16; // 16x16 sprite
  const pixels = new Uint8Array(size * size * 4);

  // Easter egg: Rainbow tamagochi for special names
  const isRainbow = seed.toLowerCase().includes("rainbow");
  const isGolden = seed.toLowerCase().includes("gold") || seed.toLowerCase().includes("special");

  let palette;
  if (isRainbow) {
    // Rainbow palette - cycles through colors
    palette = {
      primary: [255, 100, 100],
      secondary: [100, 255, 100],
      accent: [100, 100, 255],
    };
  } else if (isGolden) {
    // Golden palette
    palette = {
      primary: [255, 215, 0],
      secondary: [255, 235, 100],
      accent: [255, 195, 0],
    };
  } else {
    // Select a normal color palette
    const paletteIndex = Math.floor(rng() * colorPalettes.length);
    palette = colorPalettes[paletteIndex];
  }

  // Define the general shape of a tamagochi
  const bodyPattern = [
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 0, 2, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  ];

  // Apply pattern with some random variations
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const patternValue = bodyPattern[y][x];

      if (patternValue > 0) {
        const color =
          patternValue === 2
            ? [0, 0, 0] // Eyes are always black
            : generateColor(rng, palette);

        // Add some random variation
        const variation = rng() > 0.8 ? (rng() - 0.5) * 30 : 0;
        const r = Math.max(0, Math.min(255, color[0] + variation));
        const g = Math.max(0, Math.min(255, color[1] + variation));
        const b = Math.max(0, Math.min(255, color[2] + variation));

        setPixel(pixels, x, y, r, g, b, size);
      }
    }
  }

  return pixelsToBase64(pixels, size, size);
}
