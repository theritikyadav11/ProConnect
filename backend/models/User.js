import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  uname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "default.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  token: {
    type: String,
    default: "",
  },
  microProjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MicroProject",
    },
  ],
  achievements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MicroProject",
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
