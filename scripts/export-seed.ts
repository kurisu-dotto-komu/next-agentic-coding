#!/usr/bin/env tsx
import { ConvexHttpClient } from "convex/browser";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import { api } from "@/convex/_generated/api";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function exportSeed(seedName: string) {
  if (!seedName) {
    console.error("Usage: npm run seed:export <seed-name>");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    console.error("NEXT_PUBLIC_CONVEX_URL not set");
    process.exit(1);
  }

  const client = new ConvexHttpClient(url);

  try {
    // Export data from Convex
    const data = await client.query(api.seed.exportData);

    // Save to file
    const seedPath = path.join(__dirname, "..", "tests", "seeds", `${seedName}.json`);
    fs.writeFileSync(seedPath, JSON.stringify(data, null, 2));

    console.log(`✅ Exported seed data to: tests/seeds/${seedName}.json`);
    console.log(`   - ${data.users.length} users`);
    console.log(`   - ${data.votes.length} votes`);
  } catch (error) {
    console.error("Error exporting seed:", error);
    process.exit(1);
  }
}

const seedName = process.argv[2];
exportSeed(seedName);
