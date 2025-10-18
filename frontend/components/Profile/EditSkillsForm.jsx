import { useState } from "react";
import { updateProfileSkills } from "../../services/api";

export default function EditSkillsForm({ skills, token, onProfileUpdated }) {
  const [skillList, setSkillList] = useState(skills || []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    if (input.trim() && !skillList.includes(input.trim())) {
      setSkillList([...skillList, input.trim()]);
      setInput("");
    }
  };
  const handleRemove = (idx) => {
    setSkillList(skillList.filter((_, i) => i !== idx));
  };
  const handleSave = async () => {
    setLoading(true);
    await updateProfileSkills({ skills: skillList }, token);
    setLoading(false);
    onProfileUpdated();
  };
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add skill"
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>
      <ul className="mb-2">
        {skillList.map((skill, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {skill}
            <button onClick={() => handleRemove(idx)} className="text-red-500">
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Skills
      </button>
    </div>
  );
}
