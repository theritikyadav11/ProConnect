import { useState } from "react";
import { updateProfileInterests } from "../../services/api";

export default function EditInterestsForm({
  interests,
  token,
  onProfileUpdated,
}) {
  const [interestList, setInterestList] = useState(interests || []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    if (input.trim() && !interestList.includes(input.trim())) {
      setInterestList([...interestList, input.trim()]);
      setInput("");
    }
  };

  const handleRemove = (idx) => {
    setInterestList(interestList.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setLoading(true);
    await updateProfileInterests({ interests: interestList }, token);
    setLoading(false);
    onProfileUpdated();
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add interest"
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
        {interestList.map((interest, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {interest}
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
        {loading ? "Saving..." : "Save Interests"}
      </button>
    </div>
  );
}
