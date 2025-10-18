import React, { useState, useEffect } from "react";
import { updateProfile } from "../../services/api";

export default function EducationDetails({ profile, token, onProfileUpdated }) {
  const [isEditing, setIsEditing] = useState(false);

  const [educationList, setEducationList] = useState([
    { school: "", degree: "", fieldOfStudy: "" },
  ]);

  useEffect(() => {
    if (profile && profile.education && profile.education.length > 0) {
      setEducationList(profile.education);
    }
  }, [profile]);

  const handleChange = (index, field, value) => {
    const updatedEducation = educationList.map((edu, idx) =>
      idx === index ? { ...edu, [field]: value } : edu
    );
    setEducationList(updatedEducation);
  };

  const handleAdd = () => {
    setEducationList([
      ...educationList,
      { school: "", degree: "", fieldOfStudy: "" },
    ]);
  };

  const handleRemove = (index) => {
    setEducationList(educationList.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile({ education: educationList }, token);
      setIsEditing(false);
      if (onProfileUpdated) onProfileUpdated();
    } catch (error) {
      console.error("Failed to update education", error);
      alert("Failed to update education details");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Educational Details</h2>
      {!isEditing ? (
        <div>
          {educationList.length === 0 ? (
            <p className="text-gray-400 mb-3">No education details added</p>
          ) : (
            educationList.map((edu, idx) => (
              <div key={idx} className="mb-3 p-3 border rounded">
                <p>
                  <strong>School:</strong> {edu.school || "-"}
                </p>
                <p>
                  <strong>Degree:</strong> {edu.degree || "-"}
                </p>
                <p>
                  <strong>Field of Study:</strong> {edu.fieldOfStudy || "-"}
                </p>
              </div>
            ))
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Education
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {educationList.map((edu, idx) => (
            <div key={idx} className="p-3 border rounded relative">
              <input
                type="text"
                value={edu.school}
                onChange={(e) => handleChange(idx, "school", e.target.value)}
                placeholder="School"
                className="border rounded px-3 py-2 w-full mb-2"
                required
              />
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleChange(idx, "degree", e.target.value)}
                placeholder="Degree"
                className="border rounded px-3 py-2 w-full mb-2"
                required
              />
              <input
                type="text"
                value={edu.fieldOfStudy}
                onChange={(e) =>
                  handleChange(idx, "fieldOfStudy", e.target.value)
                }
                placeholder="Field of Study"
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
            Add Another Education
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
