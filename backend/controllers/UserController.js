import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Connection from "../models/Connection.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { calculateTrustScore } from "../services/trustScoreService.js";
import Post from "../models/Post.js";
import { computeFeedScoresForPost } from "../services/feedService.js";
import cloudinary from "../services/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const convertUserDataToPDF = async (userData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const outputPath = crypto.randomBytes(16).toString("hex") + ".pdf";
    const filePath = path.resolve(__dirname, "../uploads", outputPath);
    const stream = fs.createWriteStream(filePath);

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      reject(err);
    });

    doc.pipe(stream);

    // Add user profile picture if available
    if (userData.userId.profilePicture) {
      const profilePictureUrl = userData.userId.profilePicture;
      // Assume it's a Cloudinary URL
      doc.image(profilePictureUrl, {
        align: "center",
        width: 100,
      });
    }

    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.uname}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPosition}`);

    doc.fontSize(14).text(`Past Work:`);
    if (userData.pastWork && userData.pastWork.length > 0) {
      userData.pastWork.forEach((work) => {
        doc.fontSize(14).text(`Company Name: ${work.company}`);
        doc.fontSize(14).text(`Position: ${work.position}`);
        doc.fontSize(14).text(`Years: ${work.years}`);
      });
    } else {
      doc.fontSize(14).text("No past work information available.");
    }

    doc.end();

    stream.on("finish", () => {
      resolve(outputPath);
    });
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, uname, password } = req.body;
    if (!name || !email || !uname || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      uname,
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Some error occured", error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(404).json({ message: "Invalid Credentials" });

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });
    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json({ message: "Error occured" });
  }
};

export const updateProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "profile_pictures",
        resource_type: "auto",
      }
    );

    user.profilePicture = result.secure_url;
    await user.save();
    return res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: result.secure_url,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token });
    if (!user) return res.status(400).json({ message: "User not found" });

    const { uname, email } = newUserData;
    const existingUser = await User.findOne({ $or: [{ uname }, { email }] });
    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: "User already exists" });
      }
    }
    Object.assign(user, newUserData);
    await user.save();
    return res
      .status(200)
      .json({ message: "User profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) return res.status(400).json({ message: "User not found" });
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email uname profilePicture"
    );
    return res.status(200).json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    const user = await User.findOne({ token: token });
    if (!user) return res.status(400).json({ message: "User not found" });

    const profile_to_update = await Profile.findOne({ userId: user._id });
    if (!profile_to_update)
      return res.status(404).json({ message: "Profile not found" });

    Object.assign(profile_to_update, newProfileData);
    await profile_to_update.save();

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name uname email profilePicture"
    );
    return res.status(200).json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;
    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name uname email profilePicture"
    );
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const outputPath = await convertUserDataToPDF(userProfile);
    const pdfFilePath = path.resolve(__dirname, "../uploads", outputPath);

    if (!fs.existsSync(pdfFilePath)) {
      return res.status(404).json({ message: "PDF file not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="resume.pdf"');

    res.sendFile(pdfFilePath);
  } catch (error) {
    console.error("Download profile error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const sendConnectionRequest = async (req, res) => {
  console.log("Received connection request:", req.body);

  const { token, connectionId, purpose } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(400).json({ message: "User not found" });

    const connectionUser = await User.findById(connectionId);
    if (!connectionUser)
      return res.status(400).json({ message: "Connection user not found" });

    const existingRequest = await Connection.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest)
      return res.status(400).json({ message: "Request already sent" });

    const trustScore = await calculateTrustScore(user._id, connectionUser._id);
    const request = new Connection({
      userId: user._id,
      connectionId: connectionUser._id,
      purpose, // Save purpose of connection
      trustScore,
    });
    await request.save();
    return res.json({ message: "Request sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyConnectionsRequest = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(400).json({ message: "User not found" });

    const connections = await Connection.find({ userId: user._id })
      .populate("connectionId", "name uname email profilePicture")
      .select("connectionId status_accepted purpose trustScore"); // expose trustScore too

    return res.json(connections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const whatAreMyConnections = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Find pending (not yet accepted or rejected) connection requests sent TO current user
    const connections = await Connection.find({
      connectionId: user._id,
      status_accepted: { $in: [null, false] }, // only pending
    }).populate("userId", "name uname email profilePicture currentPost");

    return res.json(connections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(400).json({ message: "User not found" });

    const connection = await Connection.findOne({
      _id: requestId,
    });

    if (!connection)
      return res.status(400).json({ message: "Connection not found" });

    if (action_type === "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }

    await connection.save();
    return res.json({ message: "Connection updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get profile by userId (from URL param)
export const getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const userProfile = await Profile.findOne({ userId }).populate(
      "userId",
      "name uname email profilePicture"
    );
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    return res.status(200).json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get connection status between logged-in user and target userId
export const getConnectionStatusByUserId = async (req, res) => {
  try {
    const { token } = req.query; // Auth token of current user
    const { userId } = req.params; // Target user profile id

    const currentUser = await User.findOne({ token });
    if (!currentUser)
      return res.status(400).json({ message: "User not found" });

    const connectionUser = await User.findById(userId);
    if (!connectionUser)
      return res.status(400).json({ message: "Connection user not found" });

    // Search connection where currentUser sent request to connectionUser
    const connection = await Connection.findOne({
      userId: currentUser._id,
      connectionId: connectionUser._id,
    });

    if (!connection) {
      return res.status(200).json({ status: "not_connected" });
    } else if (connection.status_accepted) {
      return res.status(200).json({ status: "connected" });
    } else {
      return res.status(200).json({ status: "pending" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAcceptedConnections = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(400).json({ message: "User not found" });

    const connections = await Connection.find({
      status_accepted: true,
      $or: [{ userId: user._id }, { connectionId: user._id }],
    })
      .populate("userId", "name uname email profilePicture currentPost")
      .populate("connectionId", "name uname email profilePicture currentPost");

    return res.json(connections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// export const updateProfileSkills = async (req, res) => {
//   try {
//     const { token, skills } = req.body;
//     const user = await User.findOne({ token });
//     if (!user) return res.status(400).json({ message: "User not found" });
//     const profile = await Profile.findOne({ userId: user._id });
//     if (!profile) return res.status(404).json({ message: "Profile not found" });
//     profile.skills = Array.isArray(skills) ? skills : [];
//     await profile.save();
//     return res.status(200).json({ message: "Skills updated successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

export const updateProfileSkills = async (req, res) => {
  try {
    const { token, skills } = req.body;
    const user = await User.findOne({ token });
    if (!user) return res.status(400).json({ message: "User not found" });
    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    profile.skills = Array.isArray(skills) ? skills : [];
    await profile.save();

    // Recompute feed scores for all posts for this user
    const allPosts = await Post.find();
    for (const post of allPosts) {
      // Only update feed scores for this user
      let score = 0;
      // Skills/Interests match
      const matchedSkills = profile.skills.filter((skill) =>
        post.body.toLowerCase().includes(skill.toLowerCase())
      );
      score += matchedSkills.length * 10;

      // Get user's current interests from profile (make sure they're available)
      const matchedInterests = (profile.interests || []).filter((interest) =>
        post.body.toLowerCase().includes(interest.toLowerCase())
      );
      score += matchedInterests.length * 5;

      // Own post bonus
      if (post.userId.toString() === user._id.toString()) {
        score += 20;
      }

      await FeedScore.updateOne(
        { userId: user._id, postId: post._id },
        { $set: { score } },
        { upsert: true }
      );
    }

    return res.status(200).json({ message: "Skills updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfileInterests = async (req, res) => {
  try {
    const { token, interests } = req.body;
    const user = await User.findOne({ token });
    if (!user) return res.status(400).json({ message: "User not found" });
    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    profile.interests = Array.isArray(interests) ? interests : [];
    await profile.save();
    return res.status(200).json({ message: "Interests updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
