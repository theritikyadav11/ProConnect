// workers/feedWorker.js
import cron from "node-cron";
import Post from "../models/Post.js";
import { computeFeedScoresForPost } from "../services/feedService.js";

// Run every hour
cron.schedule("0 * * * *", async () => {
  console.log("Recomputing feed scores...");

  const posts = await Post.find({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  }); // last 7 days
  for (const post of posts) {
    await computeFeedScoresForPost(post);
  }

  console.log("Feed scores updated.");
});
