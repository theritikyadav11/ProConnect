import React, { useState, useEffect } from "react";
import { updateProfile } from "../../services/api";

export default function PersonalDetails({ profile, token, onProfileUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    uname: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.userId?.name || "",
        uname: profile.userId?.uname || "",
        email: profile.userId?.email || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(form, token);
      setIsEditing(false);
      if (onProfileUpdated) {
        onProfileUpdated(); // Refresh profile data on parent component
      }
    } catch (error) {
      console.error("Failed to update personal details", error);
      alert("Failed to update personal details");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Personal Details</h2>

      {!isEditing ? (
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {form.name || "Not set"}
          </p>
          <p>
            <strong>Username:</strong> {form.uname || "Not set"}
          </p>
          <p>
            <strong>Email:</strong> {form.email || "Not set"}
          </p>
          <p>
            <strong>Bio:</strong> {form.bio || "No bio available"}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Personal Details
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border rounded px-3 py-2 w-full"
            required
          />
          <input
            type="text"
            name="uname"
            value={form.uname}
            onChange={handleChange}
            placeholder="Username"
            className="border rounded px-3 py-2 w-full"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded px-3 py-2 w-full"
            required
          />
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="border rounded px-3 py-2 w-full h-24"
          />
          <div className="flex gap-4 mt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
