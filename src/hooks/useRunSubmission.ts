import { useState } from "react";
import type { RunApiResponse, TestResult } from "../types/resultTestType";

export const useRunAndSubmit = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [passedAll, setPassedAll] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCode = async (
    code: string,
    language: string,
    problemId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, problem_id: problemId }),
      });
      const data: RunApiResponse = await res.json();
      setResults(data.results);
      setPassedAll(data.passed);
      console.log(data.results)
      return data.results;
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async (
    code: string,
    language: string,
    problemId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          code_text: code,
          language,
          problem_id: problemId,
          passed: passedAll,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { runCode, submitCode, results, passedAll, loading, error };
};
