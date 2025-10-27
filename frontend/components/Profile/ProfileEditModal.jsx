import React from "react";
import PersonalDetails from "./PersonalDetails";
import ProfilePicture from "./ProfilePicture";
import EducationDetails from "./EducationDetails";
import WorkExperience from "./WorkExperience";
import EditSkillsForm from "./EditSkillsForm";
import EditInterestsForm from "./EditInterestsForm";

export default function ProfileEditModal({
  tab,
  setTab,
  onClose,
  profile,
  token,
  onProfileUpdated,
}) {
  return (
    <div>
      {/* Blurred overlay */}
      <div className="fixed inset-0 backdrop-blur-lg bg-opacity-0 z-40"></div>

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl h-[90vh] flex relative z-50 overflow-hidden">
          {/* Close Button */}
          <button
            className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-600 z-10"
            onClick={onClose}
          >
            &times;
          </button>

          {/* Sidebar for navigation */}
          <div className="w-1/4 bg-gray-50 p-6 border-r border-gray-200 flex flex-col space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Edit Options
            </h3>
            <button
              onClick={() => setTab("profile")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                tab === "profile"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              }`}
            >
              Personal Details
            </button>
            <button
              onClick={() => setTab("photo")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                tab === "photo"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              }`}
            >
              Profile Photo
            </button>
            <button
              onClick={() => setTab("education")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                tab === "education"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              }`}
            >
              Education Details
            </button>
            <button
              onClick={() => setTab("work")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                tab === "work"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              }`}
            >
              Work Experience
            </button>
            <button
              onClick={() => setTab("skills")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                tab === "skills"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => setTab("interests")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                tab === "interests"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              }`}
            >
              Interests
            </button>
          </div>

          {/* Content area */}
          <div className="w-3/4 p-8 overflow-y-auto">
            {tab === "profile" && (
              <PersonalDetails
                profile={profile}
                token={token}
                onProfileUpdated={onProfileUpdated}
              />
            )}

            {tab === "photo" && (
              <ProfilePicture
                profile={profile}
                token={token}
                onProfileUpdated={onProfileUpdated}
              />
            )}

            {tab === "education" && (
              <EducationDetails
                profile={profile}
                token={token}
                onProfileUpdated={onProfileUpdated}
              />
            )}

            {tab === "work" && (
              <WorkExperience
                profile={profile}
                token={token}
                onProfileUpdated={onProfileUpdated}
              />
            )}

            {tab === "skills" && (
              <EditSkillsForm
                skills={profile.skills}
                token={token}
                onProfileUpdated={onProfileUpdated}
              />
            )}

            {tab === "interests" && (
              <EditInterestsForm
                interests={profile.interests}
                token={token}
                onProfileUpdated={onProfileUpdated}
              />
            )}
            {/* --- Close Button --- */}
            <button
              onClick={onClose}
              className="mt-8 px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
