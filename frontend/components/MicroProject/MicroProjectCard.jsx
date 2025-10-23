import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaTasks, FaEye, FaUsers } from "react-icons/fa"; // Added FaUsers

const MicroProjectCard = ({ project, isAchievement = false }) => {
  const linkPath = isAchievement
    ? `/achievement/${project._id}`
    : `/microproject/${project._id}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
      <Link to={linkPath} className="block">
        <h3 className="text-xl font-semibold text-blue-700 mb-2">
          {project.title}
        </h3>
        {!isAchievement && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="flex items-center text-gray-500 text-sm mb-2">
          <FaUserCircle className="mr-2" />
          <span>Creator: {project.creator.name}</span>
        </div>

        {isAchievement && project.collaborators && (
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <FaUsers className="mr-2" />
            <span>
              Collaborators:{" "}
              {project.collaborators.map((collab) => collab.name).join(", ")}
            </span>
          </div>
        )}

        {!isAchievement && (
          <>
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <FaTasks className="mr-2" />
              <span>Tasks: {project.tasks.length}</span>
            </div>

            <div className="flex items-center text-gray-500 text-sm mb-2">
              <FaEye className="mr-2" />
              <span>Visibility: {project.visibility}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Progress: {project.progress.toFixed(0)}%
            </p>
          </>
        )}

        {project.status === "completed" && (
          <span className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full mt-3">
            Completed
          </span>
        )}
      </Link>
    </div>
  );
};

export default MicroProjectCard;
