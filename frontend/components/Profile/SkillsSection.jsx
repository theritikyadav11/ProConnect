export default function SkillsSection({ skills }) {
  return (
    <div className="bg-gray-50 rounded-xl shadow border w-72 p-5 flex flex-col items-center">
      <h3 className="font-bold text-lg mb-3">Skills</h3>
      {skills && skills.length > 0 ? (
        <ul className="text-gray-700 text-base space-y-2">
          {skills.map((skill, idx) => (
            <li key={idx} className="text-center">
              {skill}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">Not available</p>
      )}
    </div>
  );
}
