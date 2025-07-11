import { ConvexHttpClient } from "convex/browser";
import fs from "fs";
import path from "path";

import { api } from "../../convex/_generated/api";

const getConvexClient = () => {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL not set");
  }
  return new ConvexHttpClient(url);
};

export async function loadSeed(seedName: string) {
  // Read the seed file - check both test seeds and convex seed directories
  let seedPath = path.join(__dirname, "..", "seeds", `${seedName}.json`);

  // If not found in tests/seeds, check convex/seed
  if (!fs.existsSync(seedPath)) {
    seedPath = path.join(__dirname, "..", "..", "convex", "seed", `${seedName}.json`);
  }

  if (!fs.existsSync(seedPath)) {
    throw new Error(`Seed file not found in tests/seeds/ or convex/seed/: ${seedName}.json`);
  }

  const seedData = JSON.parse(fs.readFileSync(seedPath, "utf8"));

  // Import data using Convex API
  const client = getConvexClient();
  await client.mutation(api.seed.importData, seedData);
}
