import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../state/authAtom";
import {
  getUserProfileById,
  getPostsByUserId,
  downloadResume,
  sendConnectionRequest,
  getConnectionStatusByUserId, // <-- Import this (implement below)
} from "../services/api";
import PostCard from "../components/Feed/PostCard";

const PURPOSE_OPTIONS = [
  "Networking",
  "Job Inquiry",
  "Collaboration",
  "Mentorship",
  "Freelance Opportunity",
  "General",
];

export default function UserProfile() {
  const { userId } = useParams();
  const auth = useRecoilValue(authAtom);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const [connectionStatus, setConnectionStatus] = useState("not_connected");
  // "not_connected", "pending", "connected"

  // Purpose state for connection
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState(PURPOSE_OPTIONS[0]);
  const [connectLoading, setConnectLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getUserProfileById(userId, auth.token);
      setProfile(res.data);
    } catch (error) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    setPostsLoading(true);
    try {
      const res = await getPostsByUserId(userId, auth.token);
      setUserPosts(res.data.posts || []);
    } catch (error) {
      setUserPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  // Fetch connection status between current user and viewed profile user
  const fetchConnectionStatus = async () => {
    try {
      const res = await getConnectionStatusByUserId(userId, auth.token);
      // The backend should return something like { status: "pending"|"connected"|null }
      const status = res.data.status || "not_connected";
      setConnectionStatus(status);
    } catch (error) {
      setConnectionStatus("not_connected");
    }
  };

  const handleDownloadResume = async () => {
    try {
      const res = await downloadResume(userId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to download resume");
    }
  };

  // When Connect is clicked—show the dropdown
  const handleConnectClick = () => {
    setShowPurposeDropdown(true);
  };

  // Final connect handler sending data to backend
  const handleConnectConfirm = async () => {
    setConnectLoading(true);
    try {
      await sendConnectionRequest(
        { connectionId: userId, purpose: selectedPurpose },
        auth.token
      );
      alert("Connection Request Sent!");
      setConnectionStatus("pending");
    } catch (error) {
      alert("Failed to send connection request");
    } finally {
      setConnectLoading(false);
      setShowPurposeDropdown(false);
    }
  };

  // Cancel handler for dropdown
  const handleConnectCancel = () => {
    setShowPurposeDropdown(false);
  };

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
    fetchConnectionStatus();
  }, [userId, auth.token]);

  if (loading)
    return <div className="p-6 text-gray-500">Loading profile...</div>;
  if (!profile)
    return <div className="p-6 text-red-500">Failed to load profile data</div>;

  // Button text and disabled logic based on connection status
  let buttonText = "Connect";
  let buttonDisabled = false;
  if (connectionStatus === "pending") {
    buttonText = "Pending";
    buttonDisabled = true;
  } else if (connectionStatus === "connected") {
    buttonText = "Connected";
    buttonDisabled = true;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-8 space-y-6 relative font-sans">
      <div className="flex flex-col items-center space-y-2 mb-10">
        <img
          src={profile.userId.profilePicture || "default.jpg"}
          alt={profile.userId.name}
          className="w-36 h-36 rounded-full object-cover border-4 border-blue-600 shadow-md"
        />
        <h2 className="text-2xl font-bold mt-2">{profile.userId?.name}</h2>
        <p className="text-lg text-gray-500">{profile.bio}</p>
        <div className="flex space-x-3 my-3">
          <button
            onClick={handleConnectClick}
            disabled={buttonDisabled}
            className={`px-4 py-2 rounded-lg font-medium ${
              buttonDisabled
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {buttonText}
          </button>
          <button
            onClick={handleDownloadResume}
            className="px-4 py-2 bg-gray-100 rounded-lg border hover:bg-gray-200 font-medium"
          >
            Download Resume
          </button>
        </div>
        {showPurposeDropdown && (
          <div className="mt-4 bg-white shadow-lg border p-6 rounded-xl flex flex-col items-center z-20">
            <label className="mb-2 text-gray-700 font-semibold">
              What is your purpose for this connection?
            </label>
            <select
              value={selectedPurpose}
              onChange={(e) => setSelectedPurpose(e.target.value)}
              className="mb-2 px-4 py-2 border rounded-lg"
            >
              {PURPOSE_OPTIONS.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleConnectConfirm}
                disabled={connectLoading}
                className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium ${
                  connectLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {connectLoading ? "Sending..." : "Confirm"}
              </button>
              <button
                onClick={handleConnectCancel}
                className="px-4 py-2 bg-red-100 text-gray-700 rounded-lg border hover:bg-red-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-8 md:gap-16 px-4">
        <div className="bg-gray-50 rounded-xl shadow border w-72 p-5 flex flex-col items-center">
          <h3 className="font-bold text-lg mb-3">Education Details</h3>
          {profile.education && profile.education.length > 0 ? (
            <ul className="text-gray-700 text-base space-y-2">
              {profile.education.map((edu, idx) => (
                <li key={idx} className="text-center">
                  <span className="block font-medium">
                    {edu.degree} in {edu.fieldOfStudy}
                  </span>
                  <span className="block">{edu.school}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Not available</p>
          )}
        </div>
        <div className="bg-gray-50 rounded-xl shadow border w-72 p-5 flex flex-col items-center">
          <h3 className="font-bold text-lg mb-3">Work Experience</h3>
          {profile.pastWork && profile.pastWork.length > 0 ? (
            <ul className="text-gray-700 text-base space-y-2">
              {profile.pastWork.map((work, idx) => (
                <li key={idx} className="text-center">
                  <span className="block font-medium">
                    {work.position} at {work.company}
                  </span>
                  <span className="block">{work.years} years</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Not available</p>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl shadow mt-8">
        <h2 className="text-lg font-semibold mb-4">All Posts</h2>
        {postsLoading ? (
          <div>Loading posts...</div>
        ) : userPosts.length === 0 ? (
          <div>No posts found.</div>
        ) : (
          <div className="space-y-6">
            {userPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
