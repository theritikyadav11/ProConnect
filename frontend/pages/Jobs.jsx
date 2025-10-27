import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authAtom } from "../state/authAtom";
import { analyzeResume, getJobs } from "../services/api"; // Import API functions

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [errorJobs, setErrorJobs] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [errorAnalysis, setErrorAnalysis] = useState(null);
  const auth = useRecoilValue(authAtom);

  useEffect(() => {
    const fetchJobsData = async () => {
      try {
        setLoadingJobs(true);
        const response = await getJobs(); // Use the API service function
        setJobs(response.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setErrorJobs("Failed to fetch job listings.");
      } finally {
        setLoadingJobs(false);
      }
    };

    if (auth.token) {
      fetchJobsData();
    }
  }, [auth.token]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResumeFile(file);
      // No need to read text on frontend anymore, send file to backend
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resumeFile || !selectedJob) {
      setErrorAnalysis("Please upload a resume and select a job to analyze.");
      return;
    }

    setLoadingAnalysis(true);
    setErrorAnalysis(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append(
      "jobDescription",
      selectedJob.description + " " + selectedJob.requirements.join(" ")
    );

    try {
      const response = await analyzeResume(formData); // Use the API service function
      setAnalysisResult(response.data.analysis);
    } catch (err) {
      console.error("Error analyzing resume:", err);
      setErrorAnalysis(
        err.response?.data?.message ||
          "Failed to analyze resume. Please try again."
      );
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const parseAnalysisResult = (result) => {
    if (!result) return { score: "N/A", suggestions: [] };
    const scoreMatch = result.match(/FIT_SCORE: (\d+)/);
    const suggestionsMatch = result.match(/SUGGESTIONS:\n([\s\S]*)/);

    const score = scoreMatch ? scoreMatch[1] : "N/A";
    const suggestions = suggestionsMatch
      ? suggestionsMatch[1]
          .split("\n")
          .map((s) => s.trim())
          .filter((s) => s.startsWith("- "))
          .map((s) => s.substring(2))
      : [];
    return { score, suggestions };
  };

  const { score, suggestions } = parseAnalysisResult(analysisResult);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Listings</h1>

      {loadingJobs && <p className="text-blue-600">Loading jobs...</p>}
      {errorJobs && <p className="text-red-600">{errorJobs}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`bg-white p-6 rounded-lg shadow-md border-2 ${
              selectedJob?.id === job.id ? "border-blue-500" : "border-gray-200"
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {job.title}
            </h2>
            <p className="text-gray-600 mb-1">{job.company}</p>
            <p className="text-gray-500 text-sm mb-4">{job.location}</p>
            <p className="text-gray-700 text-sm mb-4">{job.description}</p>
            <h3 className="font-medium text-gray-700 mb-2">Requirements:</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm mb-4">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedJob(job)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {selectedJob?.id === job.id ? "Selected" : "Analyze my resume"}
            </button>
          </div>
        ))}
      </div>

      {selectedJob && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Analyze Resume for: {selectedJob.title} at {selectedJob.company}
          </h2>
          <div className="mb-4">
            <label
              htmlFor="resumeUpload"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Upload Resume (PDF, DOCX, or Text file):
            </label>
            <input
              type="file"
              id="resumeUpload"
              accept=".pdf,.docx,.txt,.md" // Allow PDF, DOCX, and text files
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            />
            {resumeFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: {resumeFile.name}
              </p>
            )}
          </div>

          <button
            onClick={handleAnalyzeResume}
            disabled={!resumeFile || loadingAnalysis}
            className={`bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md text-lg font-semibold ${
              (!resumeFile || loadingAnalysis) &&
              "opacity-50 cursor-not-allowed"
            }`}
          >
            {loadingAnalysis ? "Analyzing..." : "Get Analysis"}
          </button>

          {errorAnalysis && (
            <p className="text-red-600 mt-4">{errorAnalysis}</p>
          )}

          {analysisResult && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg shadow-inner">
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                Resume Analysis Result:
              </h3>
              <p className="text-lg text-blue-700 mb-2">
                <span className="font-semibold">Fit Score:</span> {score}/100
              </p>
              <h4 className="text-md font-semibold text-blue-700 mb-2">
                Suggestions for Improvement:
              </h4>
              {suggestions.length > 0 ? (
                <ul className="list-disc list-inside text-blue-600">
                  {suggestions.map((s, index) => (
                    <li key={index}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-blue-600">
                  No specific suggestions provided.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
