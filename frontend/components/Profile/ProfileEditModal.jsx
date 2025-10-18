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
      <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-40"></div>

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-md w-[600px] p-6 shadow-lg max-h-[80vh] overflow-auto relative z-50">
          {/* --- Tabs --- */}
          <div className="flex flex-wrap border-b mb-4 space-x-2">
            <button
              onClick={() => setTab("profile")}
              className={`flex-1 px-4 py-2 rounded-t ${
                tab === "profile"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Update Profile Details
            </button>
            <button
              onClick={() => setTab("photo")}
              className={`flex-1 px-4 py-2 rounded-t ${
                tab === "photo"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Update Profile Photo
            </button>
            <button
              onClick={() => setTab("education")}
              className={`flex-1 px-4 py-2 rounded-t ${
                tab === "education"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Update Education Details
            </button>
            <button
              onClick={() => setTab("work")}
              className={`flex-1 px-4 py-2 rounded-t ${
                tab === "work"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Update Work Experience
            </button>
            <button
              onClick={() => setTab("skills")}
              className={`flex-1 px-4 py-2 rounded-t ${
                tab === "skills"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Update Skills
            </button>
            <button
              onClick={() => setTab("interests")}
              className={`flex-1 px-4 py-2 rounded-t ${
                tab === "interests"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Update Interests
            </button>
          </div>

          {/* --- Tab Content --- */}
          <div className="p-4">
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
          </div>

          {/* --- Close Button --- */}
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
