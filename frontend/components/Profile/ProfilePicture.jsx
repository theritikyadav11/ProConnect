import React, { useState, useEffect } from "react";
import { updateProfilePicture } from "../../services/api";
export default function ProfilePicture({ profile, token, onProfileUpdated }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentPicture, setCurrentPicture] = useState("default.jpg");

  useEffect(() => {
    if (profile && profile.userId && profile.userId.profilePicture) {
      setCurrentPicture(profile.userId.profilePicture);
    }
  }, [profile]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select an image file first");
      return;
    }
    const formData = new FormData();
    formData.append("profile_picture", selectedFile);
    try {
      setUploading(true);
      await updateProfilePicture(formData, token);
      setSelectedFile(null);
      if (onProfileUpdated) onProfileUpdated();
    } catch (error) {
      console.error("Profile picture upload failed", error);
      alert("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 max-w-3xl mx-auto flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Update Profile Picture</h2>
      <img
        src={currentPicture}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-blue-500"
      />
      <form
        onSubmit={handleUpload}
        className="flex flex-col items-center gap-4 w-full max-w-xs"
      >
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          type="submit"
          disabled={uploading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
