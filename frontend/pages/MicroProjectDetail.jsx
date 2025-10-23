import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../state/authAtom";
import api, { getAcceptedConnections } from "../services/api";
import TaskList from "../components/MicroProject/TaskList";
import ProjectChat from "../components/MicroProject/ProjectChat"; // Assuming this component will be created
import { FaEdit, FaCheckCircle, FaUserPlus, FaEye } from "react-icons/fa";

const MicroProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useRecoilValue(authAtom);
  const currentUser = auth.user;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [isCollaborator, setIsCollaborator] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [availableConnections, setAvailableConnections] = useState([]);
  const [selectedCollaborator, setSelectedCollaborator] = useState("");

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/microprojects/${id}`);
      setProject(response.data);
      if (currentUser) {
        setIsCreator(response.data.creator._id === currentUser._id);
        setIsCollaborator(
          response.data.collaborators.some(
            (collab) => collab._id === currentUser._id
          )
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch micro project.");
      console.error("Error fetching micro project:", err);
    } finally {
      setLoading(false);
    }
  }, [id, currentUser]); // Dependencies for useCallback

  useEffect(() => {
    fetchProject();
  }, [fetchProject]); // Dependency for useEffect

  const handleCompleteProject = async () => {
    if (
      !window.confirm(
        "Are you sure you want to mark this project as completed? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      await api.post(`/api/microprojects/${id}/complete`);
      alert("Project marked as completed!");
      navigate("/profile"); // Or to a success page
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete project.");
      console.error("Error completing project:", err);
    }
  };

  const handleInviteCollaborator = async () => {
    if (!selectedCollaborator) {
      alert("Please select a collaborator to invite.");
      return;
    }
    try {
      await api.post(`/api/microprojects/${id}/invite`, {
        collaboratorId: selectedCollaborator,
      });
      alert("Invitation sent successfully!");
      setShowInviteModal(false);
      // Refresh project data to show updated collaborators
      const response = await api.get(`/api/microprojects/${id}`);
      setProject(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send invitation.");
      console.error("Error sending invitation:", err);
    }
  };

  const openInviteModal = async () => {
    try {
      // Fetch accepted connections
      const connectionsResponse = await getAcceptedConnections();
      const acceptedConnections = connectionsResponse.data;

      // Filter out existing collaborators and the project creator
      const currentCollaboratorIds = project.collaborators.map((c) => c._id);
      const filteredConnections = acceptedConnections
        .filter((conn) => conn.status_accepted === true) // Ensure only truly connected users
        .map((conn) =>
          conn.userId._id === currentUser._id ? conn.connectionId : conn.userId
        ) // Get the actual user object
        .filter(
          (user) =>
            user._id !== currentUser._id &&
            !currentCollaboratorIds.includes(user._id)
        );

      setAvailableConnections(filteredConnections);
      setShowInviteModal(true);
    } catch (err) {
      console.error("Failed to fetch connections for invitation:", err);
      setError("Failed to load connections for invitation.");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading project details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!project) {
    return <div className="text-center py-8">Project not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">{project.title}</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        {project.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Project Details</h2>
          <p>
            <strong>Creator:</strong> {project.creator.name} (
            {project.creator.uname})
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`font-medium ${
                project.status === "completed"
                  ? "text-green-600"
                  : project.status === "active"
                  ? "text-blue-600"
                  : "text-yellow-600"
              }`}
            >
              {project.status}
            </span>
          </p>
          <p>
            <strong>Progress:</strong> {project.progress.toFixed(0)}%
          </p>
          <p>
            <strong>Visibility:</strong> {project.visibility}
          </p>
          {project.duration && (
            <p>
              <strong>Duration:</strong> {project.duration}
            </p>
          )}
          {project.skillsRequired && project.skillsRequired.length > 0 && (
            <p>
              <strong>Skills:</strong> {project.skillsRequired.join(", ")}
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Collaborators</h2>
          <ul>
            {project.collaborators.map((collab) => (
              <li key={collab._id} className="flex items-center mb-2">
                <img
                  src={collab.profilePicture || "/default.jpg"}
                  alt={collab.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span>
                  {collab.name} ({collab.uname})
                </span>
              </li>
            ))}
          </ul>
          {isCreator && project.status !== "completed" && (
            <button
              onClick={openInviteModal}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <FaUserPlus className="mr-2" /> Invite Collaborator
            </button>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-3">Actions</h2>
            {isCreator && project.status !== "completed" && (
              <>
                <button
                  onClick={() => navigate(`/microproject/edit/${project._id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center w-full mb-2"
                >
                  <FaEdit className="mr-2" /> Edit Project
                </button>
                <button
                  onClick={handleCompleteProject}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded flex items-center w-full mb-2"
                >
                  <FaCheckCircle className="mr-2" /> Mark as Completed
                </button>
              </>
            )}
            {/* Add other actions like file sharing link if implemented */}
            <button
              onClick={() => alert("File sharing coming soon!")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center w-full"
            >
              <FaEye className="mr-2" /> View Shared Files
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Tasks</h2>
          {isCollaborator && project.status !== "completed" ? (
            <TaskList
              projectId={project._id}
              tasks={project.tasks}
              onTaskUpdate={fetchProject} // Pass the fetchProject function to refresh
            />
          ) : (
            <p>You must be a collaborator to manage tasks.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Discussion</h2>
          {isCollaborator ? (
            <ProjectChat projectId={project._id} />
          ) : (
            <p>You must be a collaborator to participate in the discussion.</p>
          )}
        </div>
      </div>

      {/* Invite Collaborator Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Invite Collaborator</h2>
            <div className="mb-4">
              <label
                htmlFor="selectCollaborator"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Select User:
              </label>
              <select
                id="selectCollaborator"
                value={selectedCollaborator}
                onChange={(e) => setSelectedCollaborator(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">-- Select a connection --</option>
                {availableConnections.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.uname})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowInviteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteCollaborator}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MicroProjectDetail;
