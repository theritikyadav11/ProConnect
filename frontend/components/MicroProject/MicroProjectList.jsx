import React from "react";
import MicroProjectCard from "./MicroProjectCard";

const MicroProjectList = ({ title, projects, isAchievementList = false }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600">No micro projects to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <MicroProjectCard
            key={project._id}
            project={project}
            isAchievement={isAchievementList}
          />
        ))}
      </div>
    </div>
  );
};

export default MicroProjectList;
