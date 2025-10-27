import { analyzeResumeWithGemini } from "../services/geminiService.js";
import { extractTextFromFile } from "../services/fileProcessingService.js";

const mockJobs = [
  {
    id: "1",
    title: "Software Engineer",
    company: "Tech Solutions Inc.",
    location: "San Francisco, CA",
    description:
      "We are looking for a passionate Software Engineer to design, develop, and install software solutions. You will be responsible for full lifecycle application development, from conception to deployment.",
    requirements: [
      "Bachelor's degree in Computer Science or related field.",
      "3+ years of experience in software development.",
      "Proficiency in JavaScript, Node.js, and React.",
      "Experience with RESTful APIs and database technologies.",
    ],
  },
  {
    id: "2",
    title: "Data Scientist",
    company: "Data Insights Corp.",
    location: "New York, NY",
    description:
      "Join our team as a Data Scientist to analyze complex datasets, build predictive models, and develop data-driven solutions. You will work closely with product and engineering teams.",
    requirements: [
      "Master's or Ph.D. in a quantitative field (e.g., Statistics, Computer Science, Mathematics).",
      "2+ years of experience in data science.",
      "Strong programming skills in Python or R.",
      "Experience with machine learning frameworks (e.g., TensorFlow, PyTorch).",
    ],
  },
  {
    id: "3",
    title: "Product Manager",
    company: "Innovate Labs",
    location: "Austin, TX",
    description:
      "We are seeking an experienced Product Manager to lead the development of our next-generation products. You will define product strategy, roadmaps, and specifications.",
    requirements: [
      "Bachelor's degree in Business, Engineering, or a related field.",
      "5+ years of product management experience.",
      "Proven track record of launching successful products.",
      "Excellent communication and leadership skills.",
    ],
  },
];

const getJobs = (req, res) => {
  try {
    res.status(200).json(mockJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Failed to fetch jobs." });
  }
};

const analyzeResume = async (req, res) => {
  const { jobDescription } = req.body;
  const resumeFile = req.file;

  if (!resumeFile || !jobDescription) {
    return res
      .status(400)
      .json({ message: "Resume file and job description are required." });
  }

  try {
    const resumeText = await extractTextFromFile(
      resumeFile.buffer,
      resumeFile.mimetype
    );

    const analysisResult = await analyzeResumeWithGemini(
      resumeText,
      jobDescription
    );

    res.status(200).json({ analysis: analysisResult });
  } catch (error) {
    console.error("Error in resume analysis:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to analyze resume." });
  }
};

export { getJobs, analyzeResume };
