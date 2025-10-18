import mongoose from "mongoose";

const feedScoreSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    score: { type: Number, default: 0 }, // Higher = more relevant
  },
  { timestamps: true }
);

const FeedScore = mongoose.model("FeedScore", feedScoreSchema);
export default FeedScore;
