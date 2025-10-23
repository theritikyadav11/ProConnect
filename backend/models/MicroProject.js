import mongoose from "mongoose";

const MicroProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],
    duration: {
      type: String,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "active", "completed"],
      default: "pending",
    },
    visibility: {
      type: String,
      enum: ["private", "connections"],
      default: "connections",
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    progress: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const MicroProject = mongoose.model("MicroProject", MicroProjectSchema);

export default MicroProject;
