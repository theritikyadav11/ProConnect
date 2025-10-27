export default function SkillsSection({ skills }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 border border-gray-200">
      <h3 className="font-bold text-xl text-gray-800 mb-4">Skills</h3>
      {skills && skills.length > 0 ? (
        <ul className="text-gray-700 text-base space-y-3">
          {skills.map((skill, idx) => (
            <li key={idx} className="bg-gray-50 p-3 rounded-lg shadow-sm">
              <span className="block font-semibold text-blue-600">{skill}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">Not available</p>
      )}
    </div>
  );
}
