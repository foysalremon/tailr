"use client";

import { useState, useEffect } from "react";
import type { TailoredOutput } from "@/lib/schema";
import InputForm from "./InputForm";
import LoadingView from "./LoadingView";
import ResultsView from "./ResultsView";

type Phase = "input" | "loading" | "result";

const LOADING_MESSAGES = [
  "Reading your resume…",
  "Analyzing the job requirements…",
  "Identifying skill gaps…",
  "Drafting your cover letter…",
  "Reviewing your experience…",
  "Finalizing recommendations…",
];

export default function TailorApp() {
  const [phase, setPhase] = useState<Phase>("input");
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<TailoredOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    const saved = localStorage.getItem("tailr-resume");
    if (saved) setResume(saved);
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    let idx = 0;
    setLoadingMessage(LOADING_MESSAGES[0]);
    const id = setInterval(() => {
      idx = (idx + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[idx]);
    }, 2400);
    return () => clearInterval(id);
  }, [phase]);

  const handleResumeChange = (value: string) => {
    setResume(value);
    localStorage.setItem("tailr-resume", value);
  };

  const handleSubmit = async () => {
    setError(null);
    setPhase("loading");

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail ?? data.error ?? "Unexpected server error");
      }

      setResult(data as TailoredOutput);
      setPhase("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something unexpected happened";
      setError(
        msg.toLowerCase().includes("api key") || msg.toLowerCase().includes("gemini_api_key")
          ? "No API key configured. Add GEMINI_API_KEY to your .env.local file and restart the dev server."
          : `Something went wrong: ${msg}. Try again, or shorten your inputs if they’re very long.`
      );
      setPhase("input");
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setJobDescription("");
    setPhase("input");
  };

  if (phase === "loading") {
    return <LoadingView message={loadingMessage} />;
  }

  if (phase === "result" && result) {
    return <ResultsView result={result} onReset={handleReset} />;
  }

  return (
    <InputForm
      resume={resume}
      jobDescription={jobDescription}
      onResumeChange={handleResumeChange}
      onJobDescriptionChange={setJobDescription}
      onSubmit={handleSubmit}
      error={error}
    />
  );
}
