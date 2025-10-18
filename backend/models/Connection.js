import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status_accepted: {
      // null -> pending, true -> accepted, false -> rejected
      type: Boolean,
      default: null,
    },
    purpose: {
      type: String,
      default: "",
    }, // New field
    trustScore: {
      type: Number,
      default: 0,
    }, // For AI trust score
  },
  { timestamps: true }
);

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;
