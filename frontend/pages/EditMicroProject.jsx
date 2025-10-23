import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../state/authAtom";
import api from "../services/api";
import { FaSave, FaTimes, FaTrash } from "react-icons/fa";

const EditMicroProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useRecoilValue(authAtom);
  const currentUser = auth.user;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillsRequired: [],
    duration: "",
    collaborators: [],
    visibility: "public",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/microprojects/${id}`);
        setProject(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          skillsRequired: response.data.skillsRequired,
          duration: response.data.duration || "",
          collaborators: response.data.collaborators.map(
            (collab) => collab._id
          ),
          visibility: response.data.visibility,
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch micro project for editing."
        );
        console.error("Error fetching micro project for editing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prevData) => ({
      ...prevData,
      skillsRequired: skills,
    }));
  };

  const handleRemoveCollaborator = (collabId, collabName) => {
    if (collabId === project.creator._id) {
      alert("Cannot remove the project creator as a collaborator.");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to remove ${collabName} as a collaborator?`
      )
    ) {
      setFormData((prevData) => ({
        ...prevData,
        collaborators: prevData.collaborators.filter((id) => id !== collabId),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/microprojects/${id}`, formData);
      alert("Project updated successfully!");
      navigate(`/microproject/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update micro project."
      );
      console.error("Error updating micro project:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">Loading project for editing...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!project || project.creator._id !== currentUser._id) {
    return (
      <div className="text-center py-8 text-red-500">
        You are not authorized to edit this project.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Edit Micro Project
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 font-semibold mb-1"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-gray-700 font-semibold mb-1"
          >
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="skillsRequired"
            className="block text-gray-700 font-semibold mb-1"
          >
            Skills Required (comma-separated):
          </label>
          <input
            type="text"
            id="skillsRequired"
            name="skillsRequired"
            value={formData.skillsRequired.join(", ")}
            onChange={handleSkillsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="duration"
            className="block text-gray-700 font-semibold mb-1"
          >
            Duration:
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="visibility"
            className="block text-gray-700 font-semibold mb-1"
          >
            Visibility:
          </label>
          <select
            id="visibility"
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Current Collaborators:</h3>
          <ul className="space-y-2">
            {project.collaborators.map((collab) => (
              <li
                key={collab._id}
                className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
              >
                <span>
                  {collab.name} ({collab.uname})
                  {collab._id === project.creator._id && " (Creator)"}
                </span>
                {collab._id !== project.creator._id && (
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveCollaborator(collab._id, collab.name)
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(`/microproject/${id}`)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md flex items-center"
          >
            <FaTimes className="mr-2" /> Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center"
          >
            <FaSave className="mr-2" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMicroProject;
