import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { authAtom } from "../state/authAtom"; // Assuming authAtom exists
import { getAcceptedConnections, createMicroProject } from "../services/api";
import { useNavigate } from "react-router-dom";

const CreateMicroProject = () => {
  const auth = useRecoilValue(authAtom);
  const navigate = useNavigate();
  const currentUser = auth.user;

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    skillsRequired: "", // Comma-separated string
    duration: "",
    collaborators: [], // Array of user IDs
    visibility: "connections", // 'private' or 'connections'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [connections, setConnections] = useState([]); // To store user's connections for collaborator selection

  // Fetch connections when component mounts (or from a global state if available)
  // This is a placeholder, you'll need to implement actual fetching of connections
  React.useEffect(() => {
    const fetchConnections = async () => {
      try {
        // Replace with actual API call to get user's connections
        const response = await getAcceptedConnections();
        // The response from getAcceptedConnections is an array of connection objects.
        // Each connection object has 'userId' and 'connectionId' populated with user details.
        // We need to extract the actual user objects from these connections.
        const acceptedUsers = response.data.flatMap((conn) => {
          const users = [];
          if (conn.userId && conn.userId._id !== currentUser._id) {
            users.push(conn.userId);
          }
          if (conn.connectionId && conn.connectionId._id !== currentUser._id) {
            users.push(conn.connectionId);
          }
          return users;
        });
        // Filter out duplicates and the current user
        const uniqueAcceptedUsers = Array.from(
          new Map(acceptedUsers.map((user) => [user._id, user])).values()
        );
        setConnections(uniqueAcceptedUsers || []);
      } catch (err) {
        console.error("Failed to fetch connections:", err);
        setConnections([]); // Set to empty array on error to prevent crashing
      }
    };
    fetchConnections();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    setProjectData((prevData) => ({
      ...prevData,
      skillsRequired: e.target.value,
    }));
  };

  const handleCollaboratorChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setProjectData((prevData) => ({
      ...prevData,
      collaborators: selectedOptions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...projectData,
        skillsRequired: projectData.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== ""),
        // Ensure creator is implicitly handled by backend via auth middleware
        // collaborators: projectData.collaborators, // Already an array of IDs
      };

      const response = await createMicroProject(payload);
      setSuccess("Micro Project created successfully!");
      setProjectData({
        title: "",
        description: "",
        skillsRequired: "",
        duration: "",
        collaborators: [],
        visibility: "connections",
      });
      navigate(`/microproject/${response.data._id}`); // Navigate to the new project's detail page
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create micro project."
      );
      console.error("Error creating micro project:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        Please log in to create a micro project.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Create New Micro Project
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {success}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Project Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={projectData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={projectData.description}
            onChange={handleChange}
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="skillsRequired"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Skills Required (comma-separated):
          </label>
          <input
            type="text"
            id="skillsRequired"
            name="skillsRequired"
            value={projectData.skillsRequired}
            onChange={handleSkillsChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., React, Node.js, MongoDB"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="duration"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Duration (optional):
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={projectData.duration}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., 2 weeks, 1 month"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="collaborators"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Collaborators (select from connections):
          </label>
          <select
            id="collaborators"
            name="collaborators"
            multiple
            value={projectData.collaborators}
            onChange={handleCollaboratorChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
          >
            {connections.map((connection) => (
              <option key={connection._id} value={connection._id}>
                {connection.name} ({connection.uname})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Hold Ctrl/Cmd to select multiple users.
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="visibility"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Visibility:
          </label>
          <select
            id="visibility"
            name="visibility"
            value={projectData.visibility}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="connections">Visible to all connections</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMicroProject;
