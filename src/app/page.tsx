"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);

  async function runEvaluation() {
    setIsRunning(true);
    try {
      const res = await fetch("/api/evaluate", { method: "POST" });
      if (!res.ok) throw new Error("Evaluation failed");
      const data = await res.json();
      const encoded = encodeURIComponent(JSON.stringify(data));
      router.push(`/results?data=${encoded}`);
    } catch {
      setIsRunning(false);
      alert("Something went wrong. Check your OPENROUTER_API_KEY and try again.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-blue-600">M</span>
          <span className="text-5xl font-black text-emerald-600">B</span>
          <span className="text-5xl font-black text-rose-600">T</span>
          <span className="text-5xl font-black text-violet-600">I</span>
          <span className="text-4xl font-light text-gray-300">x</span>
          <span className="text-5xl font-black text-gray-800">LLM</span>
        </div>

        <h1 className="max-w-xl text-2xl font-semibold leading-relaxed text-gray-700">
          What personality type does each AI model have?
        </h1>

        <p className="max-w-lg text-gray-500">
          We send a 48-question MBTI personality questionnaire to the top 25
          models on OpenRouter and mechanically score their answers. Same test,
          different minds.
        </p>

        {isRunning ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-violet-600" />
            <p className="text-sm font-medium text-gray-600">
              Sending questionnaire to 25 models in parallel...
            </p>
            <p className="text-xs text-gray-400">
              This takes 30-60 seconds. Each model answers 48 questions.
            </p>
          </div>
        ) : (
          <button
            onClick={runEvaluation}
            className="mt-2 cursor-pointer rounded-xl bg-violet-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-violet-700 hover:shadow-xl active:scale-95"
          >
            Run the Experiment
          </button>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-gray-400">
          <span className="rounded-full bg-gray-100 px-3 py-1">48 questions</span>
          <span className="rounded-full bg-gray-100 px-3 py-1">25 models</span>
          <span className="rounded-full bg-gray-100 px-3 py-1">4 MBTI dimensions</span>
          <span className="rounded-full bg-gray-100 px-3 py-1">Mechanically scored</span>
        </div>
      </div>
    </div>
  );
}
