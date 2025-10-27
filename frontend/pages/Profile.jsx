import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { authAtom } from "../state/authAtom";
import {
  getUserProfile,
  getPostsByUser,
  deletePost,
  downloadResume,
  getMicroProjectsByUser,
  getAchievementsByUser,
} from "../services/api";
import PostCard from "../components/Feed/PostCard";
import ProfileEditModal from "../components/Profile/ProfileEditModal";
import SkillsSection from "../components/Profile/SkillsSection";
import InterestsSection from "../components/Profile/InterestsSection";
import MicroProjectList from "../components/MicroProject/MicroProjectList";

export default function Profile() {
  const [auth] = useRecoilState(authAtom);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTab, setEditTab] = useState("profile");
  const [userMicroProjects, setUserMicroProjects] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [microProjectsLoading, setMicroProjectsLoading] = useState(true);
  const [achievementsLoading, setAchievementsLoading] = useState(true);

  const fetchProfile = async () => {
    if (auth.token) {
      setLoading(true);
      try {
        const res = await getUserProfile(auth.token);
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchUserMicroProjects = async (userId) => {
    setMicroProjectsLoading(true);
    try {
      const response = await getMicroProjectsByUser(userId);
      setUserMicroProjects(response.data);
    } catch (error) {
      console.error("Failed to fetch user micro projects", error);
      setUserMicroProjects([]);
    } finally {
      setMicroProjectsLoading(false);
    }
  };

  const fetchUserAchievements = async (userId) => {
    setAchievementsLoading(true);
    try {
      const response = await getAchievementsByUser(userId);
      setUserAchievements(response.data);
    } catch (error) {
      console.error("Failed to fetch user achievements", error);
      setUserAchievements([]);
    } finally {
      setAchievementsLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    if (auth.token) {
      setPostsLoading(true);
      try {
        const res = await getPostsByUser();
        setUserPosts(res.data.posts || []);
      } catch (error) {
        setUserPosts([]);
      } finally {
        setPostsLoading(false);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost({ post_id: postId }, auth.token);
      fetchUserPosts();
    } catch (error) {
      alert("Failed to delete post");
    }
  };

  const handleDownloadResume = async () => {
    try {
      const res = await downloadResume(profile.userId?._id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to download resume");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [auth.token]);

  useEffect(() => {
    if (profile?.userId?._id) {
      fetchUserMicroProjects(profile.userId._id);
      fetchUserAchievements(profile.userId._id);
    }
  }, [profile?.userId?._id, auth.token]);

  if (loading)
    return <div className="p-6 text-gray-500">Loading profile...</div>;
  if (!profile)
    return <div className="p-6 text-red-500">Failed to load profile data</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-8 space-y-6 relative font-sans">
      {showEditModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black bg-opacity-10 backdrop-blur-sm"></div>
          <ProfileEditModal
            tab={editTab}
            setTab={setEditTab}
            onClose={() => {
              setShowEditModal(false);
              fetchProfile();
            }}
            profile={profile}
            token={auth.token}
            onProfileUpdated={fetchProfile}
          />
        </>
      )}

      {/* --- Profile Header --- */}
      <div className="flex flex-col items-center space-y-2 mb-10">
        <img
          src={profile.userId.profilePicture || "default.jpg"}
          alt={profile.userId.name}
          className="w-36 h-36 rounded-full object-cover border-4 border-blue-600 shadow-md"
        />
        <h2 className="text-2xl font-bold mt-2">{profile.userId?.name}</h2>
        <p className="text-lg text-gray-500">{profile.bio}</p>
        <div className="flex space-x-3 my-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Edit Profile
          </button>
          <button
            onClick={handleDownloadResume}
            className="px-4 py-2 bg-gray-100 rounded-lg border hover:bg-gray-200 font-medium"
          >
            Download Resume
          </button>
        </div>
      </div>

      {/* --- Profile Details (Education, Work, Skills, Interests) --- */}
      <div className="flex flex-col sm:flex-row justify-center items-stretch gap-6 px-4">
        {/* Education */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 border border-gray-200">
          <h3 className="font-bold text-xl text-gray-800 mb-4">Education</h3>
          {profile.education && profile.education.length > 0 ? (
            <ul className="text-gray-700 text-base space-y-3 w-full">
              {profile.education.map((edu, idx) => (
                <li key={idx} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                  <span className="block font-semibold text-blue-600">
                    {edu.degree} in {edu.fieldOfStudy}
                  </span>
                  <span className="block text-sm text-gray-500">
                    {edu.school}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Not available</p>
          )}
        </div>

        {/* Work Experience */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 border border-gray-200">
          <h3 className="font-bold text-xl text-gray-800 mb-4">
            Work Experience
          </h3>
          {profile.pastWork && profile.pastWork.length > 0 ? (
            <ul className="text-gray-700 text-base space-y-3 w-full">
              {profile.pastWork.map((work, idx) => (
                <li key={idx} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                  <span className="block font-semibold text-blue-600">
                    {work.position} at {work.company}
                  </span>
                  <span className="block text-sm text-gray-500">
                    {work.years} years
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Not available</p>
          )}
        </div>

        {/* Skills */}
        <div className="flex-1">
          <SkillsSection skills={profile.skills} />
        </div>

        {/* Interests */}
        <div className="flex-1">
          <InterestsSection interests={profile.interests} />
        </div>
      </div>

      {/* --- Micro Projects --- */}
      <div className="mt-8">
        {microProjectsLoading ? (
          <div className="p-6 text-gray-500">Loading micro projects...</div>
        ) : (
          <MicroProjectList
            title="My Micro Projects"
            projects={userMicroProjects}
            isAchievementList={false}
          />
        )}
      </div>

      {/* --- Achievements --- */}
      <div className="mt-8">
        {achievementsLoading ? (
          <div className="p-6 text-gray-500">Loading achievements...</div>
        ) : (
          <MicroProjectList
            title="My Achievements"
            projects={userAchievements}
            isAchievementList={true}
          />
        )}
      </div>

      {/* --- All Posts --- */}
      <div className="bg-gray-50 p-6 rounded-xl shadow mt-8">
        <h2 className="text-lg font-semibold mb-4">All Posts</h2>
        {postsLoading ? (
          <div>Loading posts...</div>
        ) : userPosts.length === 0 ? (
          <div>No posts found.</div>
        ) : (
          <div className="space-y-6">
            {userPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
