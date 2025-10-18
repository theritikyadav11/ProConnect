import React, { useState, useEffect } from "react";
import { updateProfile } from "../../services/api";

export default function WorkExperience({ profile, token, onProfileUpdated }) {
  const [isEditing, setIsEditing] = useState(false);

  const [workList, setWorkList] = useState([
    { company: "", position: "", years: "" },
  ]);

  useEffect(() => {
    if (profile && profile.pastWork && profile.pastWork.length > 0) {
      setWorkList(profile.pastWork);
    }
  }, [profile]);

  const handleChange = (index, field, value) => {
    const updatedWork = workList.map((work, idx) =>
      idx === index ? { ...work, [field]: value } : work
    );
    setWorkList(updatedWork);
  };

  const handleAdd = () => {
    setWorkList([...workList, { company: "", position: "", years: "" }]);
  };

  const handleRemove = (index) => {
    setWorkList(workList.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ pastWork: workList }, token);
      setIsEditing(false);
      if (onProfileUpdated) onProfileUpdated();
    } catch (error) {
      console.error("Failed to update work experience", error);
      alert("Failed to update work experience");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
      {!isEditing ? (
        <div>
          {workList.length === 0 ? (
            <p className="text-gray-400 mb-3">No work experience added</p>
          ) : (
            workList.map((work, idx) => (
              <div key={idx} className="mb-3 p-3 border rounded">
                <p>
                  <strong>Company:</strong> {work.company || "-"}
                </p>
                <p>
                  <strong>Position:</strong> {work.position || "-"}
                </p>
                <p>
                  <strong>Years:</strong> {work.years || "-"}
                </p>
              </div>
            ))
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Work Experience
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {workList.map((work, idx) => (
            <div key={idx} className="p-3 border rounded relative">
              <input
                type="text"
                value={work.company}
                onChange={(e) => handleChange(idx, "company", e.target.value)}
                placeholder="Company"
                className="border rounded px-3 py-2 w-full mb-2"
                required
              />
              <input
                type="text"
                value={work.position}
                onChange={(e) => handleChange(idx, "position", e.target.value)}
                placeholder="Position"
                className="border rounded px-3 py-2 w-full mb-2"
                required
              />
              <input
                type="text"
                value={work.years}
                onChange={(e) => handleChange(idx, "years", e.target.value)}
                placeholder="Years"
                className="border rounded px-3 py-2 w-full"
                required
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
                title="Remove"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Another Work Experience
          </button>
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
