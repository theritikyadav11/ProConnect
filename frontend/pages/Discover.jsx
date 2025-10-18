export default function DiscoverPage() {
  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Discover</h2>
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <strong className="block text-lg">
            Trending Community Micro-Projects
          </strong>
          <span className="text-gray-500 text-sm">
            Jump into ongoing projects, collaborate with peers, or lead new
            initiatives.
          </span>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <strong className="block text-lg">Suggested Connections</strong>
          <span className="text-gray-500 text-sm">
            Expand your network with trusted professionals in your field.
          </span>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <strong className="block text-lg">Career Insights</strong>
          <span className="text-gray-500 text-sm">
            Access AI recommendations and industry news personalized to your
            interests.
          </span>
        </div>
      </div>
    </div>
  );
}
