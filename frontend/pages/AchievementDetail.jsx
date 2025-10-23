import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMicroProject } from "../services/api";
import { FaUserCircle, FaUsers, FaArrowLeft } from "react-icons/fa";

const AchievementDetail = () => {
  const { id } = useParams();
  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        setLoading(true);
        const res = await getMicroProject(id);
        setAchievement(res.data);
      } catch (err) {
        setError("Failed to load achievement details.");
        console.error("Error fetching achievement:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievement();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-gray-500 text-center">
        Loading achievement...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500 text-center">Error: {error}</div>;
  }

  if (!achievement) {
    return (
      <div className="p-6 text-gray-500 text-center">
        Achievement not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-8 space-y-6 font-sans">
      <Link
        to="/profile"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back to Profile
      </Link>

      <h2 className="text-3xl font-bold text-blue-800 mb-4">
        {achievement.title}
      </h2>
      <p className="text-gray-700 text-lg mb-6">{achievement.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Creator */}
        <div className="bg-gray-50 rounded-lg shadow p-4 flex items-center">
          <FaUserCircle className="text-blue-600 text-2xl mr-3" />
          <div>
            <h3 className="font-semibold text-gray-800">Creator</h3>
            <p className="text-gray-600">{achievement.creator?.name}</p>
          </div>
        </div>

        {/* Collaborators */}
        <div className="bg-gray-50 rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <FaUsers className="text-blue-600 text-2xl mr-3" />
            <h3 className="font-semibold text-gray-800">Collaborators</h3>
          </div>
          {achievement.collaborators && achievement.collaborators.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600 ml-2">
              {achievement.collaborators.map((collab) => (
                <li key={collab._id}>{collab.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 ml-2">No collaborators.</p>
          )}
        </div>
      </div>

      {/* You can add more limited details here if needed, e.g., duration, skillsRequired */}
      {achievement.duration && (
        <div className="bg-gray-50 rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Duration</h3>
          <p className="text-gray-600">{achievement.duration}</p>
        </div>
      )}

      {achievement.skillsRequired && achievement.skillsRequired.length > 0 && (
        <div className="bg-gray-50 rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Skills Used</h3>
          <ul className="flex flex-wrap gap-2">
            {achievement.skillsRequired.map((skill, index) => (
              <li
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AchievementDetail;
