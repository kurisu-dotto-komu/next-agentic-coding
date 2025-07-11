import { cronJobs } from "convex/server";

import { api } from "./_generated/api";

const crons = cronJobs();

// Update game state every 5 seconds
crons.interval("update game state", { seconds: 5 }, api.tamagochis.updateGameState);

export default crons;
