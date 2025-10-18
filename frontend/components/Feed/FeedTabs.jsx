export default function FeedTabs({ feedType, setFeedType }) {
  return (
    <div className="flex space-x-4 border-b font-medium pb-2 mb-4 bg-white">
      <button
        className={`px-3 py-2 rounded-t ${
          feedType === "professional"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-500"
        }`}
        onClick={() => setFeedType("professional")}
      >
        Professional Feed
      </button>
      <button
        className={`px-3 py-2 rounded-t ${
          feedType === "community"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-500"
        }`}
        onClick={() => setFeedType("community")}
      >
        Community Feed
      </button>
    </div>
  );
}
