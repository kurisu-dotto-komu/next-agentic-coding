#!/usr/bin/env tsx
import { ConvexHttpClient } from "convex/browser";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import { api } from "@/convex/_generated/api";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function importSeed(seedName: string) {
  if (!seedName) {
    console.error("Usage: npm run seed:import <seed-name>");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    console.error("NEXT_PUBLIC_CONVEX_URL not set");
    process.exit(1);
  }

  const client = new ConvexHttpClient(url);

  try {
    // Read seed file - check both test seeds and convex seed directories
    let seedPath = path.join(__dirname, "..", "tests", "seeds", `${seedName}.json`);

    // If not found in tests/seeds, check convex/seed
    if (!fs.existsSync(seedPath)) {
      seedPath = path.join(__dirname, "..", "convex", "seed", `${seedName}.json`);
    }

    if (!fs.existsSync(seedPath)) {
      console.error(`Seed file not found in tests/seeds/ or convex/seed/: ${seedName}.json`);
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(seedPath, "utf8"));

    // Import data to Convex
    const result = await client.mutation(api.seed.importData, data);

    // Show relative path from project root
    const relativePath = path.relative(path.join(__dirname, ".."), seedPath);
    console.log(`✅ Imported seed data from: ${relativePath}`);
    console.log(`   - ${result.importedUsers} users imported`);
    console.log(`   - ${result.importedVotes} votes imported`);
  } catch (error) {
    console.error("Error importing seed:", error);
    process.exit(1);
  }
}

const seedName = process.argv[2];
importSeed(seedName);
