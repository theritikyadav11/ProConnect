import ProfileSection from "../components/ProfileSection";
import FeedContainer from "../components/Feed/FeedContainer";
export default function HomePage() {
  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-4 space-y-6 md:space-y-0 md:space-x-6">
      {/* Profile Section */}
      <div className="w-full md:w-1/4">
        <ProfileSection />
      </div>

      {/* Feed Section */}
      <div className="w-full md:w-3/4">
        <FeedContainer />
      </div>
    </div>
  );
}
