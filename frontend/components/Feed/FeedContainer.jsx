import { useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { feedTypeAtom } from "../../state/feedTypeAtom";
import { getProfessionalPosts, getCommunityPosts } from "../../services/api";
import FeedTabs from "./FeedTabs";
import CreatePost from "../Post/CreatePost";
import PostModal from "../Post/PostModal";
import PostCard from "./PostCard";
import { getFeedPosts } from "../../services/api";

export default function FeedContainer() {
  const [feedType, setFeedType] = useRecoilState(feedTypeAtom);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const userToken = localStorage.getItem("token");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      // Pass feedType and token to getFeedPosts to match backend expectance
      const res = await getFeedPosts(feedType, userToken);
      console.log(res);
      // Backend returns posts array directly
      if (Array.isArray(res?.data)) {
        setPosts(res.data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [feedType, userToken]);

  useEffect(() => {
    if (userToken) {
      fetchPosts();
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [fetchPosts, userToken]);

  const handleModalClose = () => {
    setModalOpen(false);
    fetchPosts();
  };

  console.log(posts);

  return (
    <div className="bg-gray-50 w-full h-full flex flex-col">
      <CreatePost onOpen={() => setModalOpen(true)} />
      <FeedTabs feedType={feedType} setFeedType={setFeedType} />
      {modalOpen && (
        <PostModal
          open={modalOpen}
          onClose={handleModalClose}
          feedType={feedType}
          setPosts={setPosts}
        />
      )}
      {/* <div className="mt-4 space-y-6 flex-grow overflow-y-auto">
        {loading && (
          <div className="text-center py-8 text-gray-500">Loading posts...</div>
        )}
        {!loading && posts.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No posts to display
          </div>
        )}
        {!loading &&
          posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div> */}
      <div className="mt-4 space-y-6 flex-grow overflow-y-auto">
        {loading && (
          <div className="text-center py-8 text-gray-500">Loading posts...</div>
        )}
        {!loading && posts.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No posts to display
          </div>
        )}
        {!loading &&
          posts
            .filter((post) => post && post._id)
            .map((post) => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
}
