import { api } from "../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

export async function setupConvexForTests() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.warn("NEXT_PUBLIC_CONVEX_URL not set, skipping Convex setup");
    return;
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    // Initialize recipes if needed
    await client.mutation(api.recipes.initializeRecipes, {});

    console.log("Convex setup completed");
  } catch (error) {
    console.warn("Failed to setup Convex for tests:", error);
  }
}
