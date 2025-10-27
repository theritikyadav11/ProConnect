import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeResumeWithGemini(resumeText, jobDescription) {
  const prompt = `
Analyze the following resume against the job description.
Provide a fit score (0-100) and detailed suggestions for improvement
to better match the job role.

Resume:
${resumeText}

Job Description:
${jobDescription}

Please format the response as follows:
FIT_SCORE: [score]
SUGGESTIONS:
- [Suggestion 1]
- [Suggestion 2]
- ...
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Option A: Use the convenience text string (preferred)
    if (response.text && typeof response.text === "string") {
      return response.text;
    }

    // Option B: Fallback: concatenate all text parts from the first candidate
    const cand = response?.candidates?.[0];
    const parts = cand?.content?.parts || [];
    const text = parts
      .map((p) => (typeof p.text === "string" ? p.text : ""))
      .join("\n")
      .trim();

    if (text) return text;

    // If still empty, return a generic message
    return "FIT_SCORE: 0\nSUGGESTIONS:\n- Unable to read response text.";
  } catch (error) {
    console.error("Error analyzing resume with Gemini:", error);
    throw new Error("Failed to analyze resume with Gemini.");
  }
}

export { analyzeResumeWithGemini };
