export default function FeedTabs({ feedType, setFeedType }) {
  return (
    <div className="flex w-full bg-gray-100 rounded-lg p-1 mb-4 shadow-sm">
      <button
        className={`flex-1 py-2 text-center rounded-md transition-all duration-300 ease-in-out ${
          feedType === "professional"
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-700 hover:bg-gray-200"
        }`}
        onClick={() => setFeedType("professional")}
      >
        Professional
      </button>
      <button
        className={`flex-1 py-2 text-center rounded-md transition-all duration-300 ease-in-out ${
          feedType === "community"
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-700 hover:bg-gray-200"
        }`}
        onClick={() => setFeedType("community")}
      >
        Community
      </button>
    </div>
  );
}
