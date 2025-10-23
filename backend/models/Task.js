import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    microProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MicroProject",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
