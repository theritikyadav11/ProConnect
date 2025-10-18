import FeedScore from "../models/FeedScore.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js"; // Import Profile model
import Connection from "../models/Connection.js";

export async function computeFeedScoresForPost(post) {
  const users = await User.find();
  const updates = [];

  for (const user of users) {
    let score = 0;

    // Fetch user's profile to get skills and interests
    const userProfile = await Profile.findOne({ userId: user._id });
    if (!userProfile) {
      console.warn(
        `Profile not found for user ${user._id}. Skipping feed score calculation for this user.`
      );
      continue; // Skip if profile not found
    }

    // Defensive fallback: use empty array if undefined
    const matchedSkills = (userProfile.skills || []).filter((skill) =>
      post.body.toLowerCase().includes(skill.toLowerCase())
    );
    score += matchedSkills.length * 10;

    const matchedInterests = (userProfile.interests || []).filter((interest) =>
      post.body.toLowerCase().includes(interest.toLowerCase())
    );
    score += matchedInterests.length * 5;

    // Boost for own post
    if (post.userId.toString() === user._id.toString()) {
      score += 20;
    }

    updates.push({
      updateOne: {
        filter: { userId: user._id, postId: post._id },
        update: { $set: { score } },
        upsert: true,
      },
    });
  }

  if (updates.length > 0) {
    await FeedScore.bulkWrite(updates);
  }
}
