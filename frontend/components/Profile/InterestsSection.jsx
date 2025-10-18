export default function InterestsSection({ interests }) {
  return (
    <div className="bg-gray-50 rounded-xl shadow border w-72 p-5 flex flex-col items-center">
      <h3 className="font-bold text-lg mb-3">Interests</h3>
      {interests && interests.length > 0 ? (
        <ul className="text-gray-700 text-base space-y-2">
          {interests.map((interest, idx) => (
            <li key={idx} className="text-center">
              {interest}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">Not available</p>
      )}
    </div>
  );
}
