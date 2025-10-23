import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    microProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MicroProject",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;
